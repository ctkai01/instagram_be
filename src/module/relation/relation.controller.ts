import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { GetCurrentUser } from 'src/decorators';
import { User } from 'src/entities/auth.entity';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { FollowUserDto } from './dto/follow-user-dto';
import { RelationService } from './relation.service';

@Controller('relation')
@UseGuards(AtGuard)
@UseFilters(HttpExceptionValidateFilter)
@UseInterceptors(TransformInterceptor)
export class RelationController {
  constructor(private relationService: RelationService) {}

  @Post('/follow/:id')
  @HttpCode(200)
  async followUser(
    @Param('id', ParseIntPipe) idUser: number,
    @GetCurrentUser() userAuth: User,
    @Body()
    followUserDto: FollowUserDto,
  ) {
    const response = await this.relationService.followUser(
      idUser,
      userAuth,
      followUserDto,
    );
    return response;
    // if (response.getResponse) {
    //   return res
    //     .status(response.getStatus())
    //     .json(response.getResponse())
    //     .send();
    // }
    // return res.status(200).json(response).send();
  }
}
