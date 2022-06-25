import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { flattenDeep } from 'lodash';
import { join } from 'path';
import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { ActiveConversation } from 'src/entities/active-conversation.entity';
import { User } from 'src/entities/auth.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
// import fs from 'fs';
const mkdirp = require('mkdirp');
const fs = require('fs').promises;

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
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .leftJoin('conversation.messages', 'message')
      .where('user.id = :userId', { userId })
      .orderBy('conversation.updated_at', 'DESC')
      .getMany();
  }

  async getUsersInConversation(
    conversationId: number,
  ): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.users', 'user')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndSelect('message.user', 'userMess')
      .where('conversation.id = :conversationId', { conversationId })
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  async getConversationsWithUsers(userId: number): Promise<Conversation[]> {
    const conversationsUser = await this.getConversationsForUser(userId);

    console.log('FUck', conversationsUser)

    const usersInConversation = await Promise.all(
      conversationsUser.map(
        async (conversation) =>
          await this.getUsersInConversation(conversation.id),
      ),
    );
    console.log('hello', usersInConversation)

    const usersInConversationFlat = flattenDeep(usersInConversation);

    return usersInConversationFlat;

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

  // async writeFile(path: string, content: string) {
  //   await mkdirp(path);
  //   fs.writeFileSync(path, content, {encoding: 'base64'} );
  // }

  async createMessage(message: Message, saveFileName: string): Promise<Observable<Message>> {
    if (message.image) {
      // const type = message.image.match(/^data:image\/(png|jpeg);base64,/)[1];
      // const saveFileName = './public/uploads/messages/' + uuid() + `.${type}`;
      // const saveFileName = '/' + uuid() + `.${type}`;
      // this.writeFile(saveFileName,  this.getBase64Image(message.image))
      // message['image'] = saveFileName
      //       return from(this.messageRepository.save(message));
      await fs.writeFile(
        saveFileName,
        this.getBase64Image(message.image),
        {
          encoding: 'base64',
          flag: 'w+'
        },
        function (err) {
          if (err !== null) {
            console.log('Fuck you', err);
          } else {
            console.log('Send photo success!');
           
          }
        },
      );
       const dataSave: Message = {
              conversation: message.conversation,
              image: saveFileName.slice(2),
              user: message.user
            }
      return from(this.messageRepository.save(dataSave));

    } else {
      return from(this.messageRepository.save(message));

    }
  }

  deleteMessage(message: Message): Observable<DeleteResult> {
      return from(this.messageRepository.delete({id: message.id}));
  }



  getActiveUsers(conversationId: number): Observable<ActiveConversation[]> {
    console.log('Id', conversationId)
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

  getBase64Image(imgData: string) {
    // return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    return imgData.split(';base64,').pop();
  }
}
