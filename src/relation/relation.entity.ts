import { User } from 'src/auth/auth.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActiveStatus } from '../post/enum/active-status';
import { FollowStatus } from '../post/enum/follow-status.enum';

@Entity('relations')
export class Relation {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  user_id: number;

  @Column()
  friend_id: number;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_follow?: FollowStatus;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_block?: ActiveStatus;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_restrict?: ActiveStatus;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_first_follow?: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => User, (user) => user.follower)
  @JoinColumn({ name: 'user_id' })
  userFollower?: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'friend_id' })
  userFollowing?: User;
}
