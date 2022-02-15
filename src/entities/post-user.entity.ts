import { ActiveStatus } from 'src/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Post } from './post.entity';

@Entity({ name: 'post_user' })
export class PostUser {
  @PrimaryGeneratedColumn('increment')
  id?: string;

  @Column()
  user_id: number;

  @Column()
  post_id: number;

  @Column()
  is_like: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => Post, (post) => post.usersPost, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.postUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
