// import {
//   Column,
//   Entity, OneToMany,
//   PrimaryGeneratedColumn
// } from 'typeorm';
// import { ChatMember } from './chat-member.entity';
// import { Message } from './messages.entity';

// @Entity({ name: 'chat_topics' })

// export class ChatTopic {
//   @PrimaryGeneratedColumn('increment')
//   id?: number;

//   @OneToMany(() => ChatMember, (chatMember) => chatMember.chatTopic)
//   chatMemberTopic?: ChatMember[];

//   @OneToMany(() => Message, (message) => message.chatTopic)
//   messages?: Message[];

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at?: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updated_at?: string;
// }
