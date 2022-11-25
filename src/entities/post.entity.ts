import { ActiveStatus } from 'src/constants';
import { Pagination } from 'src/interface';
import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { PostUser } from './post-user.entity';

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

  @Column({ default: ActiveStatus.NO_ACTIVE })
  is_hide_like_view?: ActiveStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @Column({ default: ActiveStatus.NO_ACTIVE })
  status?: ActiveStatus;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  user?: User;

  @OneToMany(() => Media, (media) => media.post)
  media?: Media[];

  @OneToMany(() => PostUser, (postUser) => postUser.post)
  usersPost?: PostUser[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  getPostCountPaginate?(
    data: Post[],
    pagination: Pagination,
  ): [Post[], number] {
    const { skip, take } = pagination;
    const count = data.length;
    const posts = data.slice(skip, take + skip);

    return [posts, count];
  }

  like_count?: number;
  is_like?: ActiveStatus;
  comment_count?: number;

  async getCountLike?(): Promise<number> {
    const countUserLike = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.postUsers', 'post_users')
      .where('post_users.post_id = :postId', { postId: this.id })
      .andWhere('post_users.is_like = :like', {
        like: ActiveStatus.ACTIVE,
      })
      .getCount();
    return countUserLike;
  }

  async getCountComment?(): Promise<number> {
    const countComment = (await getRepository(Comment).find({
      where: { post_id: this.id },
    })).length;

    return countComment;
  }

  async isLike?(userAuth: User): Promise<ActiveStatus> {
    const isLike = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.postUsers', 'post_users')
      .where('post_users.post_id = :postId', { postId: this.id })
      .andWhere('post_users.user_id = :userId', { userId: userAuth.id })
      .andWhere('post_users.is_like = :like', {
        like: ActiveStatus.ACTIVE,
      })
      .getCount();
    return isLike;
  }
}
