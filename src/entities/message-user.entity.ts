// import { ActiveStatus } from 'src/constants';
// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn
// } from 'typeorm';
// import { User } from './auth.entity';
// import { Message } from './messages.entity';

// @Entity({ name: 'message_user' })
// export class MessageUser {
//   @PrimaryGeneratedColumn('increment')
//   id?: number;

//   @Column()
//   message_id: number;

//   @Column()
//   user_id: number;

//   @Column()
//   is_like: ActiveStatus;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at?: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updated_at?: string;

//   @ManyToOne(() => Message, (message) => message.userMessage, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'message_id' })
//   message: Message;

//   @ManyToOne(() => User, (user) => user.messageUser, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'user_id' })
//   user: User;
// }
