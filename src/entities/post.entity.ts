import { ActiveStatus } from 'src/constants';
import { Pagination } from 'src/interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Media } from './media.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  created_by?: number | User;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_off_comment?: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Media, (media) => media.post)
  media?: Media[];

  getPostCountPaginate?(
    data: Post[],
    pagination: Pagination,
  ): [Post[], number] {
    const { skip, take } = pagination;
    const count = data.length;
    const posts = data.slice(skip, take + skip);

    return [posts, count];
  }
}
