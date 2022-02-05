import { Post } from 'src/post/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaType } from './enum/media-enum';

export type MediaEntity = 'Post';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  name: string;

  @Column()
  type: MediaType;

  @ManyToOne(() => Post, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post?: Post;

  // @Exclude()
  // @Column({ nullable: true })
  // post_id?: number | Post;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
