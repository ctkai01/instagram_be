import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_conversation')
export class ActiveConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  userId: number;

  @Column()
  conversationId: number;
}