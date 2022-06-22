// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne, OneToMany, PrimaryGeneratedColumn
// } from 'typeorm';
// import { User } from './auth.entity';
// import { ChatTopic } from './chat-topics.entity';
// import { MessageUser } from './message-user.entity';

// @Entity({ name: 'messages' })

// export class Message {
//   @PrimaryGeneratedColumn('increment')
//   id?: number;

//   @Column({ nullable: true })
//   text?: string;

//   @Column({ nullable: true })
//   image?: string;

//   @Column()
//   user_id?: number | User;

//   @Column()
//   chat_topic_id?: number | User;

//   @ManyToOne(() => User, (user) => user.messages, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
//   user?: User;

//   @ManyToOne(() => ChatTopic, (chatTopic) => chatTopic.messages, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'chat_topic_id', referencedColumnName: 'id' })
//   chatTopic?: ChatTopic;

//   @OneToMany(() => MessageUser, (messagesUser) => messagesUser.message)
//   userMessage?: MessageUser[];


//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at?: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updated_at?: string;
// }
