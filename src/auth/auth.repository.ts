import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { full_name, password, user_name, phoneOrEmail } = createUserDto;
    const {} = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const data: User = {
      user_name,
      name: full_name,
      password: hashPassword,
    };
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regexEmail.test(phoneOrEmail);

    isEmail ? (data.email = phoneOrEmail) : (data.phone = phoneOrEmail);

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
}
