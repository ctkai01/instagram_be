import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { ConflictException } from '@nestjs/common';
import { defaultAvatar } from 'src/untils/until';
import { User } from 'src/entities/auth.entity';

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

  async getUserByIdWithRelation(userId: number): Promise<User> {
    const user = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.posts', 'posts')
      .leftJoinAndSelect('posts.media', 'media')
      .where('users.id = :userId', { userId: userId })
      .orderBy('posts.created_at', 'DESC')
      .getOne();
    return user;
  }

  async getUserByUserNameOrFullname(search: string): Promise<User[]> {
    const users = await this.createQueryBuilder('users')
      .where('users.user_name  like :search', { search: `${search}%` })
      .orWhere('users.name  like :search', { search: `${search}%` }).getMany()

      return users
  }

  async getUserByUserNameOrFullnameHome(search: string): Promise<User[]> {
    const users = await this.createQueryBuilder('users')
      .where('users.user_name  like :search', { search: `%${search}%` })
      .orWhere('users.name  like :search', { search: `%${search}%` }).getMany()

      return users
  }
}
