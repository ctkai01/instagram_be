// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn
// } from 'typeorm';
// import { User } from './auth.entity';
// import { ChatTopic } from './chat-topics.entity';

// @Entity({ name: 'chat_member' })

// export class ChatMember {
//   @PrimaryGeneratedColumn('increment')
//   id?: number;

//   @Column()
//   user_id: number;

//   @Column()       
//   chat_topic_id: number;
  

//   @ManyToOne(() => User, (user) => user.chatMemberUsers, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @ManyToOne(() => ChatTopic, (chatTopic) => chatTopic.chatMemberTopic, {
//     onDelete: 'CASCADE',
//   })

//   @JoinColumn({ name: 'chat_topic_id' })
//   chatTopic: ChatTopic;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at?: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updated_at?: string;
// }
