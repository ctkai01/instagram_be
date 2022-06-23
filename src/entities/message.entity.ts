import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Conversation } from './conversation.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  message?: string;

  @ManyToOne(() => User, (user) => user.messages)
  user?: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.messages,
  )
  conversation?: Conversation;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
