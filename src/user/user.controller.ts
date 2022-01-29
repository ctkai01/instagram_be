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
import { HttpExceptionValidateFilter } from 'src/auth/exception/http-exception.filter';
import { ResponseData } from 'src/interface/response.interface';
import { AtGuard } from 'src/common/guards';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { UserService } from './user.service';

@Controller('user')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id/following')
  getFollowerByIdUser(
    @Param('id', ParseIntPipe) idUser: number,
    @Query('page', ParseIntPipe) page: number,
  ): ResponseData {
    return this.userService.listFollowingByUserId(idUser, page);
  }
}
