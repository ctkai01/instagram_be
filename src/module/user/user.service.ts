import { AuthService } from './../auth/auth.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { sortBy } from 'lodash';
import { User } from 'src/entities/auth.entity';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
import { UserRepository } from 'src/module/auth/auth.repository';
import { UserFollowCollection } from 'src/resource/user/user-follow.collection';
import { UserHomeSearchCollection } from 'src/resource/user/user-home-search.collection';
import { UserSearchCollection } from 'src/resource/user/user-search.collection';
import { UserSimilarCollection } from 'src/resource/user/user-similar.collection';
import { UserStoryCollection } from 'src/resource/user/user-story.collection';
import { UserCollection } from 'src/resource/user/user.collection';
import { UserResource } from 'src/resource/user/user.resource';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';
import { ChangePasswordDto } from './dto/change-password-dto';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { UserLoginResource } from 'src/resource/user/user-login.resource';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async listFollowingByUserId(
    idUser: number,
    pageNumber: number,
    userAuth: User,
  ): Promise<ResponseData> {
    const user = await this.userRepository.getUserById(idUser);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    let [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      +pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    let [data, count] = await user.getFollowingAndCountPagination(pagination);

    const checkIndexAuthUser = data.findIndex(
      (user) => user.id === userAuth.id,
    );

    if (checkIndexAuthUser != -1) {
      const userAuthFollowing = data[checkIndexAuthUser];
      data.splice(checkIndexAuthUser, 1);
      data.unshift(userAuthFollowing);
    }

    const dataFollowing = await UserFollowCollection(data, userAuth);
    const responseData: ResponseData = {
      data: paginateResponse([dataFollowing, count], page, take),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async listFollowerByUserId(
    idUser: number,
    pageNumber: number,
    userAuth: User,
  ): Promise<ResponseData> {
    const user = await this.userRepository.getUserById(idUser);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      +pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    let [data, count] = await user.getFollowerAndCountPagination(pagination);

    const checkIndexAuthUser = data.findIndex(
      (user) => user.id === userAuth.id,
    );

    if (checkIndexAuthUser != -1) {
      const userAuthFollower = data[checkIndexAuthUser];
      data.splice(checkIndexAuthUser, 1);
      data.unshift(userAuthFollower);
    }

    const dataFollower = await UserFollowCollection(data, userAuth);
    const responseData: ResponseData = {
      data: paginateResponse([dataFollower, count], page, take),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async profileUserByUserName(userName: string, userAuth: User) {
    const user = await this.userRepository.getUserByUserNameWithRelation(
      userName,
    );
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const responseData: ResponseData = {
      data: await UserResource(user, userAuth),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async searchUserByUserNameAndFullName(
    search: string,
    userAuth: User,
  ): Promise<ResponseData> {
    const take = this.configService.get('search.take');

    let users;
    if (search) {
      users = await this.userRepository.getUserByUserNameOrFullname(search);
      users = users.slice(0, take || 1);
    } else {
      users = [];
    }

    const dataSearchUser = await UserSearchCollection(users, userAuth);
    const responseData: ResponseData = {
      data: dataSearchUser,
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async searchUserByUserNameAndFullNameHome(
    search: string,
    userAuth: User,
  ): Promise<ResponseData> {
    const take = this.configService.get('search.take');
    let users = await this.userRepository.getUserByUserNameOrFullnameHome(
      search,
    );
    users = users.slice(0, take || 1);

    const dataSearchUser = await UserHomeSearchCollection(users, userAuth);

    const responseData: ResponseData = {
      data: dataSearchUser,
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async listSimilarByUsername(
    userName: string,
    userAuth: User,
  ): Promise<ResponseData> {
    const user = await this.userRepository.getUserByUserName(userName);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    let data = await user.getSimilarUsers(userAuth);

    const dataUserSimilar = await UserSimilarCollection(data, userAuth);
    const responseData: ResponseData = {
      data: dataUserSimilar,
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async listUsersSuggestForYou(
    userAuth: User,
    count: number,
  ): Promise<ResponseData> {
    let userSuggest = await this.userRepository.getUserSuggestForYou(
      userAuth,
      count,
    );

    // console.log(userSuggest)
    const dataSuggest = await UserFollowCollection(userSuggest, userAuth, true);

    const responseData: ResponseData = {
      data: dataSuggest,
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async checkHasFollowing(userAuth: User): Promise<ResponseData> {
    let checkHasFollowing = await userAuth.countFollowingUser();

    const responseData: ResponseData = {
      data: !!checkHasFollowing,
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async getStoryHome(userAuth: User) {
    let idsUserFollowing = await userAuth.getFollowing();
    idsUserFollowing.push(userAuth.id);

    const users = (
      await this.userRepository.getStoryHome(idsUserFollowing)
    ).filter((user) => user.stories.length);

    const sortUsers = sortBy(users, (user) => {
      return user.stories[user.stories.length - 1].created_at;
    }).reverse();
    const checkIndexExistUserAuth = sortUsers.findIndex(
      (user) => user.id === userAuth.id,
    );

    if (checkIndexExistUserAuth !== -1) {
      const userAuthStories = sortUsers.splice(checkIndexExistUserAuth, 1)[0];
      console.log(userAuthStories);
      console.log(checkIndexExistUserAuth);
      sortUsers.unshift(userAuthStories);
    }

    const responseData: ResponseData = {
      data: await UserStoryCollection(sortUsers, userAuth),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userAuth: User) {
    const { old_password, new_password } = changePasswordDto;
    const checkPassword = bcrypt.compareSync(old_password, userAuth.password);

    if (!checkPassword) {
      throw new InternalServerErrorException('Password incorrect');
    }
    const passwordNewHash =  await this.authService.hashData(new_password);
    userAuth.password = passwordNewHash

    await this.userRepository.save(userAuth);

    const responseData: ResponseData = {
      message: 'Change password Data Successfully',
    };

    return responseData;
  }

  async updateProfile(userAuth: User, updateProfileDto: UpdateProfileDto) {
    const { bio, name, website } = updateProfileDto;


    userAuth.bio = bio
    userAuth.name = name
    userAuth.website = website

    await this.userRepository.save(userAuth);
    const responseData: ResponseData = {
      data: await UserLoginResource(userAuth, userAuth),
      message: 'Update profile Successfully',
    };

    return responseData;
  }

  async updateAvatar(userAuth: User, file: Express.Multer.File) {

    userAuth.avatar = file.path.replace('\\', '\\');

    await this.userRepository.save(userAuth);
    const responseData: ResponseData = {
      data: await UserLoginResource(userAuth, userAuth),
      message: 'Update profile Successfully',
    };

    return responseData;
  }
}
