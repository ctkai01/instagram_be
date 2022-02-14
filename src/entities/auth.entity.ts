import { Exclude } from 'class-transformer';
import {
  ActiveStatus,
  ActivityStatus,
  FollowStatus,
  Gender,
  PrivateStatus,
  Status,
  StoryStatus,
} from 'src/constants';
import { Pagination } from 'src/interface';
import {
  Brackets,
  Column,
  Entity,
  getRepository,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Relation } from './relation.entity';
import { Story } from './story.entity';

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

  @Column()
  avatar: string;

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

  @OneToMany(() => Story, (story) => story.user)
  stories?: Story[];

  @OneToMany(() => Relation, (relation) => relation.userFollower)
  follower?: Relation[];

  @OneToMany(() => Relation, (relation) => relation.userFollowing)
  following?: Relation[];

  is_following?: FollowStatus;

  count_follower?: number;

  count_following?: number;

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

  async countFollowingUser?(): Promise<number> {
    const countFollowing = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.following', 'relations')
      .where('relations.user_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .getCount();

    return countFollowing;
  }

  async idsNotFollowingAndBlockUser?(): Promise<number[]> {
    const idsUser = await getRepository(User)
      .createQueryBuilder('users')
      .select('users.id')
      .leftJoin('users.following', 'relations')
      .where('relations.user_id = :userId', { userId: this.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('relations.is_follow != :follow', {
            follow: FollowStatus.FOLLOW,
          }).orWhere(
            new Brackets((q) => {
              q.where('relations.is_block = :statusBlock', {
                statusBlock: ActiveStatus.ACTIVE,
              }).orWhere('relations.blocked = :statusBlock', {
                statusBlock: ActiveStatus.ACTIVE,
              });
            }),
          );
        }),
      )
      .getMany();

    return idsUser.map((idUser: User) => idUser.id);
  }

  async countFollowerUser?(): Promise<number> {
    const countFollower = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.follower', 'relations')
      .where('relations.friend_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .getCount();

    return countFollower;
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
      .addOrderBy('posts.created_at', 'DESC')
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    return [usersFollowing, count];
  }

  async getFollowerAndCountPagination?(
    pagination: Pagination,
  ): Promise<[User[], number]> {
    const { skip, take } = pagination;
    const [usersFollower, count] = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin('users.follower', 'relations')
      .leftJoinAndSelect('users.posts', 'posts')
      .leftJoinAndSelect('posts.media', 'media')
      .where('relations.friend_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .orderBy('relations.created_at', 'DESC')
      .addOrderBy('posts.created_at', 'DESC')
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    return [usersFollower, count];
  }
}
