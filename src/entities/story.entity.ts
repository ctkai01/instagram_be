import { MediaType } from 'src/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TextStory } from '../interface/text-story.interface';
import { User } from './auth.entity';
import { UserStory } from './user-story.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: true })
  media?: string;

  @Column({ nullable: true })
  typeMedia?: MediaType;

  @Column({ nullable: true })
  created_by?: number | User;

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @Column('json', { nullable: true })
  text_json?: TextStory;

  @OneToMany(() => UserStory, (userStories) => userStories.story)
  userStories?: UserStory[];


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
