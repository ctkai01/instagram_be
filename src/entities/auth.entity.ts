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
import { PostUser } from './post-user.entity';
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
  password?: string;

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

  @Column({ default: ActivityStatus.NO_ACTIVE })
  is_tick?: ActivityStatus;

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

  @OneToMany(() => PostUser, (postUser) => postUser.user)
  postUsers?: PostUser[];

  is_following?: FollowStatus;

  count_follower?: number;

  count_following?: number;

  followed_by?: string[];

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
          )
        }),
      )
      .getMany();
        console.log(idsUser)
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
      // .leftJoinAndSelect('posts.user', 'user')
      .where('relations.user_id = :userId', { userId: this.id })
      .andWhere('relations.is_follow = :follow', {
        follow: FollowStatus.FOLLOW,
      })
      .addOrderBy('posts.created_at', 'DESC')
      .orderBy('relations.created_at', 'ASC')
      .limit(take)
      .offset(skip)
      .getManyAndCount();
    
    return [usersFollowing, count];
  }

  async getSimilarUsers?(
    userAuth: User
  ): Promise<User[]> {
    const [usersFollowing, idsUserAuthFollowing] = await Promise.all([
     this.getFollowingUser(), 
     userAuth.getFollowing()]
    )

    const idUserDeleted = new Set(idsUserAuthFollowing);

    const usersSimilar = usersFollowing.filter(user => {
      return !idUserDeleted.has(user.id)
    })

    const checkIndexAuthUser = usersSimilar.findIndex(user => user.id === userAuth.id)

    if (checkIndexAuthUser != -1) {
      usersSimilar.splice(checkIndexAuthUser, 1);
    }
    
    return usersSimilar;
  }

  async getFollowing?(): Promise<number[]> {

    let usersFollowing = await getRepository(User)
    .createQueryBuilder('users')
    .select(['users.id']) 
    .leftJoin('users.following', 'relations')
    .where('relations.user_id = :userId', { userId: this.id })
    .andWhere('relations.is_follow = :follow', {
      follow: FollowStatus.FOLLOW,
    })
    .getMany()

    const idsUser = usersFollowing.map(users => users.id)
    return idsUser
  } 

  async getFollowingUser?(): Promise<User[]> {

    let usersFollowing = await getRepository(User)
    .createQueryBuilder('users')
    .leftJoin('users.following', 'relations')
    .where('relations.user_id = :userId', { userId: this.id })
    .andWhere('relations.is_follow = :follow', {
      follow: FollowStatus.FOLLOW,
    })
    .getMany()

    return usersFollowing
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
      .addOrderBy('posts.created_at', 'DESC')
      .orderBy('relations.created_at', 'DESC')
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    return [usersFollower, count];
  }

  async getFollowedBy?(authUser: User): Promise<string[]> {
    const users = await getRepository(User)
    .createQueryBuilder('users')
    .select(['users.user_name']) 
    .leftJoin('users.follower', 'relations')
    .where('relations.friend_id = :userId', { userId: this.id })
    .andWhere('relations.is_follow = :follow', {
      follow: FollowStatus.FOLLOW,
    })
    .andWhere('users.id IN (:...followingAuth)', { followingAuth: await authUser.getFollowing()})
    .getMany()

    const userNamesUser = users.map(user => user.user_name)
    return userNamesUser
  }
}
