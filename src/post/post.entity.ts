import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentPostStatus } from './enum/comment-post-status.enum';
import { Media } from './media.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  created_by?: number | User;

  @Column({ default: CommentPostStatus.NO_ACTIVE })
  is_off_comment?: CommentPostStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Media, (media) => media.post)
  media?: Media[];
}
