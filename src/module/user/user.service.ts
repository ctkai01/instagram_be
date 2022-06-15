import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
import { UserRepository } from 'src/module/auth/auth.repository';
import { UserFollowCollection } from 'src/resource/user/user-follow.collection';
import { UserHomeSearchCollection } from 'src/resource/user/user-home-search.collection';
import { UserSearchCollection } from 'src/resource/user/user-search.collection';
import { UserCollection } from 'src/resource/user/user.collection';
import { UserResource } from 'src/resource/user/user.resource';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
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

    const [data, count] = await user.getFollowingAndCountPagination(pagination);

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

    const [data, count] = await user.getFollowerAndCountPagination(pagination);
    const dataFollower = await UserFollowCollection(data, userAuth);
    const responseData: ResponseData = {
      data: paginateResponse([dataFollower, count], page, take),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async profileUserByUserName(userName: string, userAuth: User) {
    const user = await this.userRepository.getUserByUserNameWithRelation(userName);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const responseData: ResponseData = {
      data: await UserResource(user, userAuth),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async searchUserByUserNameAndFullName(search: string): Promise<ResponseData> {
    const take = this.configService.get('search.take');

    let users;
    if (search) {
      users = await this.userRepository.getUserByUserNameOrFullname(search);
      users = users.slice(0, take || 1);
    } else {
      users = [];
    }

    const dataSearchUser = await UserSearchCollection(users);
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
}
