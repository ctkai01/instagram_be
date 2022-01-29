import { ResponseData } from 'src/interface/response.interface';
import {
  Body,
  Controller,
  Header,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/auth/auth.entity';
import { GetCurrentUser } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { HttpExceptionValidateFilter } from './../auth/exception/http-exception.filter';
import { RelationService } from './relation.service';
import { instanceOfResponseData } from 'src/untils/check-type-response';
import { Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Relation } from './relation.entity';
import { FollowUserDto } from './dto/follow-user-dto';

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
    // @Res() res: Response,
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
