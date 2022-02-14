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

  @Get('/:id/following')
  getFollowingByIdUser(
    @Param('id', ParseIntPipe) idUser: number,
    @Query('page', ParseIntPipe) page: number,
    @GetCurrentUser() userAuth: User,
  ): ResponseData {
    return this.userService.listFollowingByUserId(idUser, page, userAuth);
  }

  @Get('/:id/follower')
  getFollowerByIdUser(
    @Param('id', ParseIntPipe) idUser: number,
    @GetCurrentUser() userAuth: User,
    @Query('page', ParseIntPipe) page?: number | undefined,
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
}
