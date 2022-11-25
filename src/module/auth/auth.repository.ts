import { Brackets, EntityRepository, In, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { ConflictException } from '@nestjs/common';
import { defaultAvatar, getStartEndDateNowTimeStamp } from 'src/untils/until';
import { User } from 'src/entities/auth.entity';
import _ = require('lodash');
import { take } from 'lodash';
import moment = require('moment');
import { ActiveStatus } from 'src/constants';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { full_name, password, user_name, account } = createUserDto;

    const data: User = {
      user_name,
      name: full_name,
      password: password,
      avatar: defaultAvatar(),
    };
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regexEmail.test(account);

    isEmail ? (data.email = account) : (data.phone = account);

    try {
      const user = this.create(data);
      const userCreated = await this.save(user);
      return userCreated;
    } catch (err) {
      console.log(err);
      if (err.code === 'ER_DUP_ENTRY') {
        if (isEmail) {
          throw new ConflictException('Email already exists');
        }
        throw new ConflictException('Phone already exists');
      }
    }
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.findOne(userId);
    return user;
  }

  async getUserByUserName(userName: string): Promise<User> {
    const user = (await this.find({ where: { user_name: userName } })).shift();
    return user;
  }

  async getUserByUserNameWithRelation(userName: string): Promise<User> {
    const user = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.posts', 'posts')
      .leftJoinAndSelect('posts.media', 'media')
      .leftJoinAndSelect('posts.user', 'user')
      // .leftJoinAndSelect('posts.message', 'message')
      // .leftJoinAndSelect('message.childComments', 'childComments')
      // .leftJoinAndSelect('message.userComments', 'userComments')
      .where('users.user_name = :userName', { userName: userName })
      .orderBy('posts.created_at', 'DESC')
      .getOne();
    return user;
  }

  async getUserByUserNameOrFullname(search: string): Promise<User[]> {
    const users = await this.createQueryBuilder('users')
      .where('users.user_name  like :search', { search: `${search}%` })
      .orWhere('users.name  like :search', { search: `${search}%` })
      .getMany();

    return users;
  }

  async getUserByUserNameOrFullnameHome(search: string): Promise<User[]> {
    const users = await this.createQueryBuilder('users')
      .where('users.user_name  like :search', { search: `%${search}%` })
      .orWhere('users.name  like :search', { search: `%${search}%` })
      .getMany();

    return users;
  }

  async getUserSuggestForYou(userAuth: User, count: number): Promise<User[]> {
    const checkHasFollowing = await userAuth.getFollowingUser();

    if (checkHasFollowing.length) {
      const users = await Promise.all(
        checkHasFollowing.map(async (user: User): Promise<User[]> => {
          return user.getFollowingUserRelation();
        }),
      );
      // console.log('Lodash', _)
      const userFlatten = _.flattenDeep(users);
      const userUnique = _.uniq(userFlatten);

      const idsUserFollowing = await userAuth.getFollowing();
      idsUserFollowing.push(userAuth.id);
      const idsToDeleteSet = new Set(idsUserFollowing);

      let results = userUnique.filter((user) => {
        return !idsToDeleteSet.has(user.id);
      });

      if (results.length < count) {
        let idResultUsers = results.map((user) => user.id);
        idResultUsers = idResultUsers.concat(idsUserFollowing);
        const countRemain = count - results.length;

        // const t = await this.find({
        //   where: {
        //     id: Not(In(idResultUsers)),
        //   },
        //   relations: ['posts', 'posts.media'],
        //   take:countRemain
        //   // order: {
        //   //   posts: 'DESC'
        //   // }
        // });
        // console.log('FUck', t);
        const users = await this.createQueryBuilder('users')
          .leftJoinAndSelect('users.posts', 'posts')
          .leftJoinAndSelect('posts.media', 'media')
          .where('users.id NOT IN (:...roles)')
          .setParameter('roles', [...idResultUsers])
          .take(countRemain)
          .getMany();

        results = results.concat(users);
      }

      results = results.splice(0, count);

   
      return results.splice(0, count);
    } else {
      const users = await this.createQueryBuilder('users')
        .leftJoinAndSelect('users.posts', 'posts')
        .leftJoinAndSelect('posts.media', 'media')
        .where('users.id != :userId', { userId: userAuth.id })
        .take(count)
        .getMany();

      return users;
    }

    // .where('users.user_name  like :search', { search: `%${search}%` })
    // .orWhere('users.name  like :search', { search: `%${search}%` }).getMany()
  }


  async getStoryHome(idsUserFollowing: number[]) {
    const users = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.stories', 'story')
      .where('users.id  IN (:...userIds)')
      .where('story.status = :status', { status: ActiveStatus.ACTIVE })
      .setParameter('userIds', [...idsUserFollowing])
      .orderBy('story.created_at', 'ASC')
      .getMany();

      console.log('Hello', users)

      const usersEffectStory = users.map(user => {
        const storiesEffect = user.stories.filter(story => {
          return (new Date(story.created_at)).getTime() >= moment().startOf('day').valueOf() && (new Date(story.created_at)).getTime() <= moment().endOf('day').valueOf() 
        })
        console.log('Effect', storiesEffect)
        user.stories = storiesEffect
        return user
      })

      // const storiesEffect = users.filter(story => {
      //   return (new Date(story.created_at)).getTime() >= moment().startOf('day').valueOf() && (new Date(story.created_at)).getTime() <= moment().endOf('day').valueOf() 
      // })
      return usersEffectStory
  }

  async getStoryByUserName(user_name: string) {
    const user = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.stories', 'story')
      .where('users.user_name = :userName', { userName: user_name })
      .where('story.status = :status', { status: ActiveStatus.ACTIVE })
      .orderBy('story.created_at', 'ASC')
      .getOne();
      
      const storiesEffect = user.stories.filter(story => {
        return (new Date(story.created_at)).getTime() >= moment().startOf('day').valueOf() && (new Date(story.created_at)).getTime() <= moment().endOf('day').valueOf() 
      })
      user.stories = storiesEffect
      return user
  }
}
