import { ActiveStatus, MediaType } from 'src/constants';
import {
  Column,
  Entity,
  getRepository,
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

  is_view?: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  async getIsView?(idUserAuth: number): Promise<ActiveStatus> {
    const checkExist = await getRepository(Story)
      .createQueryBuilder('stories')
      .leftJoin('stories.userStories', 'userStories')
      .where('userStories.story_id = :storyId', { storyId: this.id })
      .andWhere('userStories.user_id = :userId', {
        userId: idUserAuth,
      })
      .andWhere('userStories.is_view = :isView', {
        isView: ActiveStatus.ACTIVE
      })
      .getOne();

      return checkExist ? ActiveStatus.ACTIVE : ActiveStatus.NO_ACTIVE
  }
}
