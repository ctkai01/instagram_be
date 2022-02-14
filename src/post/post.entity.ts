import { User } from 'src/auth/auth.entity';
import { Pagination } from 'src/interface/pagination.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActiveStatus } from './enum/active-status';
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
