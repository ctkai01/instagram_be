import { ActiveStatus } from 'src/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Comment } from './comment.entity';
import { Post } from './post.entity';

@Entity({ name: 'comment_user' })
export class CommentUser {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  user_id: number;

  @Column()
  comment_id: number;

  @Column()
  is_like: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => Comment, (comment) => comment.userComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;


  @ManyToOne(() => User, (user) => user.commentUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
