import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { CommentUser } from './comment-user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  content: string;

  @Column()
  created_by?: number | User;

  @Column()
  post_id?: number | Post;

  @Column({ nullable: true })
  parent_id?: number | Comment;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post?: Post;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments?: Comment[];

  @OneToMany(() => CommentUser, (commentUser) => commentUser.comment)
  userComments?: CommentUser[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
