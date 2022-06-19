import { ActiveStatus } from 'src/constants';
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
import { CommentUser } from './comment-user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  content: string;

  @Column()
  created_by?: number | User;

  @Column()
  post_id?: number | Post;

  @Column({ nullable: true })
  parent_id?: number | Comment;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post?: Post;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments?: Comment[];

  @OneToMany(() => CommentUser, (commentUser) => commentUser.comment)
  userComments?: CommentUser[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  like_count?: number;
  is_like?: ActiveStatus;

  async getCountLike?(): Promise<number> {
    const countUserLike = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.commentUsers', 'comment_users')
      .where('comment_users.comment_id = :commentId', { commentId: this.id })
      .andWhere('comment_users.is_like = :like', {
        like: ActiveStatus.ACTIVE,
      })
      .getCount();
    return countUserLike;
  }

  async isLike?(userAuth: User): Promise<ActiveStatus> {
    const isLike = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.commentUsers', 'comment_users')
      .where('comment_users.comment_id = :commentId', { commentId: this.id })
      .andWhere('comment_users.user_id = :userId', { userId: userAuth.id })
      .andWhere('comment_users.is_like = :like', {
        like: ActiveStatus.ACTIVE,
      })
      .getCount();
    return isLike;
  }















  // async subComments?(): Promise<Comment[]> {
  //   const comments = await getRepository(Comment)
  //     .createQueryBuilder('comments')
  //     .leftJoinAndSelect('comments.user', 'users')
  //     .leftJoinAndSelect('comments.post', 'posts')
  //     .leftJoinAndSelect('users.posts', 'postsUser')
  //     .leftJoinAndSelect('postsUser.media', 'media')
  //     .where('comments.parent_id = :commentId', { commentId: this.id })
  //     .getMany()
  //     // .where('comments.id IN (:...idComments)')
  //     // .setParameter('idComments', [...idResultUsers])
  //     return comments
  //   // return 
  // }

}
