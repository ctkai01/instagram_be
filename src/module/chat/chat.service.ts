import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { flattenDeep } from 'lodash';
import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { ActiveConversation } from 'src/entities/active-conversation.entity';
import { User } from 'src/entities/auth.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ActiveConversation)
    private readonly activeConversationRepository: Repository<ActiveConversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  getConversation(
    creatorId: number,
    friendId: number,
  ): Observable<Conversation | undefined> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :creatorId', { creatorId })
        .orWhere('user.id = :friendId', { friendId })
        .groupBy('conversation.id')
        .having('COUNT(*) > 1')
        .getOne(),
    ).pipe(map((conversation: Conversation) => conversation || undefined));
  }
  
  // getConversationsForUser(userId: number): Observable<Conversation[]> {
  //   return from(
  //     this.conversationRepository
  //       .createQueryBuilder('conversation')
  //       .leftJoin('conversation.users', 'user')
  //       .where('user.id = :userId', { userId })
  //       // .orderBy('conversation.lastUpdated', 'DESC')
  //       .getMany(),
  //   );
  // }

  // getUsersInConversation(conversationId: number): Observable<Conversation[]> {
  //   console.log('RUNING 222')
    
  //   return from(
  //     this.conversationRepository
  //       .createQueryBuilder('conversation')
  //       .innerJoinAndSelect('conversation.users', 'user')
  //       .where('conversation.id = :conversationId', { conversationId })
  //       .getMany(),
  //   );
  // }


  // getConversationsWithUsers(userId: number): Observable<Conversation[]> {
  //   console.log('RUNING')
  //   return this.getConversationsForUser(userId).pipe(
  //     take(1),
  //     switchMap((conversations: Conversation[]) => {
  //       console.log('RV', conversations)
  //       return conversations
  //     }),
  //     mergeMap((conversation: Conversation) => {
  //       return this.getUsersInConversation(conversation.id);
  //     }),
  //   );
  // }
    
  async getConversationsForUser(userId: number): Promise<Conversation[]> {
    return await
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .leftJoin('conversation.messages', 'message')
        .where('user.id = :userId', { userId })
        // .orderBy('conversation.lastUpdated', 'DESC')
        .getMany()
  }

  async getUsersInConversation(conversationId: number): Promise<Conversation[]> {
    
    return await 
      this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoinAndSelect('conversation.users', 'user')
        .innerJoinAndSelect('conversation.messages', 'message')
        .innerJoinAndSelect('message.user', 'userMess')
        .where('conversation.id = :conversationId', { conversationId })
        .orderBy('message.created_at', 'ASC')
        .getMany()
  }

  async getConversationsWithUsers(userId: number): Promise<Conversation[]> {
    console.log('RUNING')
    const conversationsUser = await this.getConversationsForUser(userId)
    const usersInConversation = await Promise.all(conversationsUser.map(async (conversation) => await this.getUsersInConversation(conversation.id)))
    const usersInConversationFlat = flattenDeep(usersInConversation)

    return usersInConversationFlat
   
    // return this.getConversationsForUser(userId).pipe(
    //   take(1),
    //   switchMap((conversations: Conversation[]) => {
    //     console.log('RV', conversations)
    //     return conversations
    //   }),
    //   mergeMap((conversation: Conversation) => {
    //     // return this.getUsersInConversation(conversation.id);
    //   }),
    // );
  }

  leaveConversation(socketId: string): Observable<DeleteResult> {
    return from(this.activeConversationRepository.delete({ socketId }));
  }

  createConversation(creator: User, friend: User): Observable<Conversation> {
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: Conversation) => {
        const doesConversationExist = !!conversation;
        if (!doesConversationExist) {
          const newConversation: Conversation = {
            users: [creator, friend],
          };
          return from(this.conversationRepository.save(newConversation));
        }
        return of(conversation);
      }),
    );
  }

  createMessage(message: Message): Observable<Message> {
    return from(this.messageRepository.save(message));
  }

  getActiveUsers(conversationId: number): Observable<ActiveConversation[]> {
    return from(
      this.activeConversationRepository.find({
        where: [{ conversationId }],
      }),
    );
  }


  joinConversation(
    friendId: number,
    userId: number,
    socketId: string,
  ): Observable<ActiveConversation> {
    return this.getConversation(userId, friendId).pipe(
      switchMap((conversation: Conversation) => {
        if (!conversation) {
          console.warn(
            `No conversation exists for userId: ${userId} and friendId: ${friendId}`,
          );
          return of();
        }
        const conversationId = conversation.id;
        return from(this.activeConversationRepository.findOne({ userId })).pipe(
          switchMap((activeConversation: ActiveConversation) => {
            if (activeConversation) {
              return from(
                this.activeConversationRepository.delete({ userId }),
              ).pipe(
                switchMap(() => {
                  return from(
                    this.activeConversationRepository.save({
                      socketId,
                      userId,
                      conversationId,
                    }),
                  );
                }),
              );
            } else {
              return from(
                this.activeConversationRepository.save({
                  socketId,
                  userId,
                  conversationId,
                }),
              );
            }
          }),
        );
      }),
    );
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return from(
      this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversation.id =:conversationId', { conversationId })
        .orderBy('message.created_at', 'ASC')
        .getMany(),
    );
  }
  
}
