import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveConversation } from 'src/entities/active-conversation.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../auth/auth.repository';
import { AuthService } from '../auth/auth.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Conversation, ActiveConversation, Message]),
  ],
  // imports: [TypeOrmModule.forFeature([CommentRepository, UserRepository, PostRepository])],
  providers: [ChatGateway, ChatService],
  // controllers: [EventsGateway],
})
export class ChatModule {}
