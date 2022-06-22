import {
    Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Message } from './message.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToMany(() => User)
  @JoinTable()
  users?: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages?: Message[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
