import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, Observable, of, Subscription, take, tap } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ActiveConversation } from 'src/entities/active-conversation.entity';
import { User } from 'src/entities/auth.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { AtGuard } from 'src/guards';
import { ConversationCollection } from 'src/resource/conversation/conversation.collection';
import { MessageCollection } from 'src/resource/message/message.collection';
import { MessageResource } from 'src/resource/message/message.resource';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { v4 as uuid } from 'uuid';
import { CreateConversation } from 'src/interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('Events Gateway');

  @UseGuards(AtGuard)
  async handleConnection(socket: Socket) {
    this.logger.log(`socket connect: ${socket.id}`);

    const jwt = socket.handshake.headers.authorization || null;
    this.logger.log(`JWT: ${jwt}`);
    // console.log(' JWT', socket.handshake)
    // const user = await this.authService.getJwtUser(jwt);
    // if (!user) {
    //   console.log('No USER');
    //   this.handleDisconnect(socket);
    // } else {
    //   socket.data.user = user;
    //   this.getConversations(socket, user.id);
    // }

    this.authService.getJwtUser(jwt).subscribe(async (user: Promise<User>) => {
      const userAuth = await user;
      if (!userAuth) {
        console.log('No USER');
        this.handleDisconnect(socket);
      } else {
        socket.data.user = userAuth;
        console.log(userAuth);

        this.getConversations(socket, userAuth.id);
      }
    });
  }

  async getConversations(socket: Socket, userId: number) {
    const conversations = await this.chatService.getConversationsWithUsers(
      userId,
    );
    const conversationsTransform = ConversationCollection(
      conversations,
      socket.data.user.id,
    );
    this.server.to(socket.id).emit('conversations', conversationsTransform);
    // .subscribe((conversations) => {
    //   console.log('Conver', conversations)
    //   this.logger.log(`Conver`);

    //   this.server.to(socket.id).emit('conversations', conversations);
    // });
  }

  afterInit(server: any) {
    this.logger.log('Initial');
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`socket disconnect: ${socket.id}`);
    this.chatService.leaveConversation(socket.id).pipe(take(1)).subscribe();
  }

  @SubscribeMessage('createConversation')
  createConversation(socket: Socket, data: CreateConversation) {
    this.chatService
      .createConversation(socket.data.user, data.user)
      .pipe(take(1))
      .subscribe((conversation) => {
        this.getConversations(socket, socket.data.user.id);
        const newMessage: Message = {
          user: data.authUser,
          conversation
        }
        if (data.message) {
          newMessage['message'] = data.message
        } else if (data.image) {
          newMessage['image'] = data.image
        }
        console.log('NEW GAME', newMessage)
       this.chatService.joinConversation(data.user.id, socket.data.user.id, socket.id).pipe(take(1)).subscribe((activeConversations: ActiveConversation) => {
        this.handleMessage(socket, newMessage)

       })

      });
  }

  // async handleMessageCreateConversation(socket: Socket, newMessage: Message) {
  //   if (!newMessage.conversation) return of(null);

  //   const { user } = socket.data;
  //   newMessage.user = user;

  //   if (newMessage.conversation.id) {
  //     let saveFileName = '';
  //     let isImage = false;
  //     if (newMessage.image) {
  //       isImage = true;
  //       const type = newMessage.image.match(
  //         /^data:image\/(png|jpeg);base64,/,
  //       )[1];
  //       saveFileName = './public/uploads/messages/' + uuid() + `.${type}`;
  //     }

  //     (await this.chatService.createMessage(newMessage, saveFileName))
  //       .pipe(take(1))
  //       .subscribe((message: Message) => {
  //         newMessage.id = message.id;
  //         if (isImage) {
  //           newMessage.image = message.image;
  //         }
  //         this.chatService
  //           .getActiveUsers(newMessage.conversation.id)
  //           .pipe(take(1))
  //           .subscribe((activeConversations: ActiveConversation[]) => {
  //             console.log('FUCCCCC', activeConversations)
  //             activeConversations.forEach(
  //               (activeConversation: ActiveConversation) => {
  //                 const transFormMessage = MessageResource(newMessage);
  //                 console.log('NEWWWWWWWWWW')
  //                 this.server
  //                   .to(activeConversation.socketId)
  //                   .emit('newMessage', transFormMessage);
  //               },
  //             );
  //           });
  //       });
  //   }
  // }




  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, newMessage: Message) {
    if (!newMessage.conversation) return of(null);

    const { user } = socket.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      let saveFileName = '';
      let isImage = false;
      if (newMessage.image) {
        isImage = true;
        const type = newMessage.image.match(
          /^data:image\/(png|jpeg);base64,/,
        )[1];
        saveFileName = './public/uploads/messages/' + uuid() + `.${type}`;
      }

      (await this.chatService.createMessage(newMessage, saveFileName))
        .pipe(take(1))
        .subscribe((message: Message) => {
          newMessage.id = message.id;
          if (isImage) {
            newMessage.image = message.image;
          }
          this.chatService
            .getActiveUsers(newMessage.conversation.id)
            .pipe(take(1))
            .subscribe((activeConversations: ActiveConversation[]) => {
              console.log('send messs 2', activeConversations)
            
              activeConversations.forEach(
                (activeConversation: ActiveConversation) => {
                  const transFormMessage = MessageResource(newMessage);
                 
                  this.server
                    .to(activeConversation.socketId)
                    .emit('newMessage', transFormMessage);
                  console.log('SEND MESSAGE WITH conversation ID: ', activeConversation.socketId)

                },
              );
            });
        });
    }
  }

  @SubscribeMessage('deleteMessage')
  deleteMessage(socket: Socket, data) {
    const { user } = socket.data;
    if (data.message.user.id !== user.id) return of(null);

    if (data.conversationId) {
      this.chatService
        .deleteMessage(data.message)
        .pipe(take(1))
        .subscribe(() => {
          this.chatService
            .getActiveUsers(data.conversationId)
            .pipe(take(1))
            .subscribe((activeConversations: ActiveConversation[]) => {
              activeConversations.forEach(
                (activeConversation: ActiveConversation) => {
                  this.server
                    .to(activeConversation.socketId)
                    .emit('deletedMessage', { idMessageDelete: data.message.id, idConversation: data.conversationId});
                },
              );
            });
        });
    }
  }

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: number) {
    this.chatService
      .joinConversation(friendId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeConversation: ActiveConversation) => {
          this.chatService
            .getMessages(activeConversation.conversationId)
            .pipe(take(1))
            .subscribe((messages: Message[]) => {
              const messageTransform = MessageCollection(messages);
              this.server.to(socket.id).emit('messages', messageTransform);
            });
        }),
      )
      .pipe(take(1))
      .subscribe();
  }


  @SubscribeMessage('leaveConversation')
  leaveConversation(socket: Socket) {
    this.chatService.leaveConversation(socket.id).pipe(take(1)).subscribe();
  }

  // @SubscribeMessage('msgToServer')
  // sendMessage(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: { message: string },
  // ): void {
  //   // const { name, room_id } = this.users[client.id];
  //   // client.broadcast.to(room_id).emit('receive-message', { ...body, name });
  //   // console.log(body);
  // }

  // @SubscribeMessage('join')
  // joinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: { room_id: string },
  // ): void {

  //   const { room_id } = body;
  //   // this.users[client.id] = { name, room_id };
  //   client.join(room_id);

  //   console.log('join', client.id, body);
  // }
}
