import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/auth.repository';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
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
  ): Promise<ResponseData> {
    const user = await this.userRepository.getUserById(idUser);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const [take, page, skip] = calcPaginate(
      this.configService.get('following.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    const data = await user.getFollowingAndCountPagination(pagination);
    console.log(paginateResponse(data, page, take));
    console.log(data);
    const responseData: ResponseData = {
      data: paginateResponse(data, page, take),
      // data: data,
      message: 'Get Data Successfully',
    };

    return responseData;
  }
}
