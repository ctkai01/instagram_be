import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { ActivityStatus } from './enum/activy-status.enum';
import { Gender } from './enum/gender.enum';
import { PrivateStatus } from './enum/private.enum';
import { Status } from './enum/status.enum';
import { StoryStatus } from './enum/story-status.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column({ nullable: false, unique: true })
  user_name: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  bio?: string;

  @Exclude()
  @Column({ nullable: true, type: 'longtext' })
  refresh_token?: string;

  @Column({ nullable: true })
  gender?: Gender;

  @Column({ default: Status.ACTIVE })
  status?: Status;

  @Column({ default: PrivateStatus.PUBLIC })
  is_private?: PrivateStatus;

  @Column({ default: ActivityStatus.ACTIVE })
  status_activity?: ActivityStatus;

  @Column({ default: StoryStatus.ACTIVE })
  status_story?: StoryStatus;

  @Column({ nullable: true, type: 'json' })
  status_notification?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  [key: string]: any;
}
