import { ActiveStatus, MediaType } from 'src/constants';
import { TagsUserPost } from 'src/interface/tag-user-post.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  name: string;

  @Column()
  type: MediaType;

  @Column({nullable: true})
  cover_name?: string;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_mute?: ActiveStatus;

  // tags: 
  @Column({type: 'json', nullable: true})
  tags_user?: TagsUserPost[];

  @ManyToOne(() => Post, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post?: Post;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
