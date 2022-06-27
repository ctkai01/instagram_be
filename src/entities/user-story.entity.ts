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
import { Story } from './story.entity';

@Entity({ name: 'user_story' })
export class UserStory {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  user_id: number;

  @Column()
  story_id: number;

  @Column()
  is_view: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => Story, (story) => story.userStories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: Story;


  @ManyToOne(() => User, (user) => user.storyUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
