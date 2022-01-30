import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { UserRepository } from 'src/auth/auth.repository';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
import { FollowingResource } from 'src/resource/following.resource';
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

    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    const [data, count] = await user.getFollowingAndCountPagination(pagination);
    const dataFollowing = await UserCollection(data, userAuth);
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
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    const [data, count] = await user.getFollowerAndCountPagination(pagination);
    const dataFollower = await UserCollection(data, userAuth);
    const responseData: ResponseData = {
      data: paginateResponse([dataFollower, count], page, take),
      message: 'Get Data Successfully',
    };

    return responseData;
  }

  async profileUserById(userId: number, userAuth: User) {
    const user = await this.userRepository.getUserByIdWithRelation(userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const responseData: ResponseData = {
      data: await UserResource(user, userAuth),
      message: 'Get Data Successfully',
    };

    return responseData;
  }
}
