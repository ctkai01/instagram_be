import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { ResponseData } from 'src/interface/response.interface';
import { AtGuard } from 'src/guards';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/decorators';
import { User } from 'src/entities/auth.entity';

@Controller('user')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('home')
  async searchUserByUserNameAndFullNameHome(
    @Query('search') search: string,
    @GetCurrentUser() userAuth: User,
  ): Promise<ResponseData> {
    return this.userService.searchUserByUserNameAndFullNameHome(
      search,
      userAuth,
    );
  }

  @Get('/:id/following')
  getFollowingByIdUser(
    @Param('id') idUser: number,
    @Query('page') page: number,
    @GetCurrentUser() userAuth: User,
  ): ResponseData {
    return this.userService.listFollowingByUserId(idUser, page, userAuth);
  }

  @Get('/:id/follower')
  getFollowerByIdUser(
    @Param('id') idUser: number,
    @GetCurrentUser() userAuth: User,
    @Query('page') page?: number | undefined,
  ): ResponseData {
    return this.userService.listFollowerByUserId(idUser, page, userAuth);
  }

  @Get('/:id')
  getProfileUser(
    @Param('id', ParseIntPipe) idUser: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.userService.profileUserById(idUser, userAuth);
  }

  @Get('')
  searchUserByUserNameAndFullName(
    @Query('search') search: string,
  ): Promise<ResponseData> {
    return this.userService.searchUserByUserNameAndFullName(search);
  }
}
