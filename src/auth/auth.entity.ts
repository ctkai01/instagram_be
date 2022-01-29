import { Exclude } from 'class-transformer';
import { Pagination } from 'src/interface/pagination.interface';
import { FollowStatus } from 'src/post/enum/follow-status.enum';
import { Post } from 'src/post/post.entity';
import {
  BaseEntity,
  Column,
  Entity,
  getRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  SelectQueryBuilder,
} from 'typeorm';
import { SelectQueryBuilderOption } from 'typeorm/query-builder/SelectQueryBuilderOption';
import { Relation } from '../relation/relation.entity';
import { ActivityStatus } from './enum/activy-status.enum';
import { Gender } from './enum/gender.enum';
import { PrivateStatus } from './enum/private.enum';
import { Status } from './enum/status.enum';
import { StoryStatus } from './enum/story-status.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column({ nullable: false, unique: true })
  user_name: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  bio?: string;

  @Exclude()
  @Column({ nullable: true, type: 'longtext' })
  refresh_token?: string;

  @Column({ nullable: true })
  gender?: Gender;

  @Column({ default: Status.ACTIVE })
  status?: Status;

  @Column({ default: PrivateStatus.PUBLIC })
  is_private?: PrivateStatus;

  @Column({ default: ActivityStatus.ACTIVE })
  status_activity?: ActivityStatus;

  @Column({ default: StoryStatus.ACTIVE })
  status_story?: StoryStatus;

  @Column({ nullable: true, type: 'json' })
  status_notification?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  [key: string]: any;

  @OneToMany(() => Relation, (relation) => relation.userFollower)
  follower?: Relation[];

  @OneToMany(() => Relation, (relation) => relation.userFollowing)
  following?: Relation[];

  async isFollowing?(userTarget: User): Promise<FollowStatus> {
    const isFollowing = await getRepository(User)
      .createQueryBuilder('users')
      .innerJoin('users.following', 'relations')
      .where('relations.user_id = :userId', { userId: this.id })
      .andWhere('relations.friend_id = :friendId', { friendId: userTarget.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .getCount();

    return Boolean(isFollowing) ? FollowStatus.FOLLOW : FollowStatus.UN_FOLLOW;
  }

  async getFollowingAndCountPagination?(
    pagination: Pagination,
  ): Promise<[User[], number]> {
    const { skip, take } = pagination;
    const [usersFollowing, count] = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.following', 'relations')
      .leftJoinAndSelect('users.posts', 'posts')
      .leftJoinAndSelect('posts.media', 'media')
      .where('relations.user_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .orderBy('relations.created_at', 'DESC')
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    return [usersFollowing, count];
  }

  async getFollower?(): Promise<User[]> {
    const usersFollower = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.follower', 'relations')
      .leftJoinAndSelect('users.posts', 'posts')
      .leftJoinAndSelect('posts.media', 'media')
      .where('relations.friend_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .orderBy('media.id', 'DESC')
      .orderBy('relations.created_at', 'DESC')
      .getMany();

    return usersFollower;
  }
}
