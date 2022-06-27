import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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

  @Get('stories')
  getStoryHome(@GetCurrentUser() userAuth: User) {
    return this.userService.getStoryHome(userAuth);
  }



  @Get('/check-has-following')
  checkHasFollowing(
    @GetCurrentUser() userAuth: User,
  ) {
    return this.userService.checkHasFollowing(userAuth);
  }

  @Get('/suggest-for-you')
  getUsersSuggestForYou(
    @Query('count') count: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.userService.listUsersSuggestForYou(userAuth, count);
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

  @Get('/:userName')
  getProfileUser(
    @Param('userName') userName: string,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.userService.profileUserByUserName(userName, userAuth);
  }

  @Get('')
  searchUserByUserNameAndFullName(
    @Query('search') search: string,
  ): Promise<ResponseData> {
    return this.userService.searchUserByUserNameAndFullName(search);
  }

  @Get('/:userName/similar_accounts')
  getUsersSimilar(
    @Param('userName') userName: string,
    @GetCurrentUser() userAuth: User,
  ): Promise<ResponseData> {
    return this.userService.listSimilarByUsername(userName, userAuth);
  }
}
