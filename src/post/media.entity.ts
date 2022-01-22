import { Post } from 'src/post/post.entity';
import { MediaType } from './enum/media-enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @JoinColumn({ name: 'post_id' })
  post?: Post;

  @Column({ nullable: true })
  post_id?: number | Post;
}
