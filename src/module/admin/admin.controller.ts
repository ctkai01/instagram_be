import {
  Body,
  Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { Public } from 'src/decorators';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { AdminGuard } from 'src/guards/admin.guard ';
import { AdminService } from './admin.service';
import { LoginAminDto } from './dto/login-admin-dto';

@Controller('admin')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Post('/login')
  login(@Body() loginUserDto: LoginAminDto) {
    return this.adminService.login(loginUserDto)
  }

  @Public()
  @Get('/posts-review')
  postsReview(
    @Query('page', ParseIntPipe) pageNumber: number,
  ) {
    return this.adminService.postReview(pageNumber)
  }


  @Public()
  @Post('/posts-review/:id')
  postsReviewAccept(
    @Param('id', ParseIntPipe) idPost: number,
  ) {
    return this.adminService.postReviewAccept(idPost)
  }

  @Public()
  @Get('/stories-review')
  storiesReview(
  ) {
    return this.adminService.storiesReview()
  }


  @Public()
  @Get('/users')
  allUser(
    @Query('page', ParseIntPipe) pageNumber: number,

  ) {
    return this.adminService.allUser(pageNumber)
  }

  @Public()
  @Delete('/users/:id')
  deleteUser(
    @Param('id', ParseIntPipe) idUser: number,
  ) {
    return this.adminService.deleteUser(idUser)
  }


  @Public()
  @Post('/stories-review/:id')
  storiesReviewAccept(
    @Param('id', ParseIntPipe) idStory: number,
  ) {
    return this.adminService.storiesReviewAccept(idStory)
  }

  @Public()
  @Delete('/posts/:id')
  deletePost(
    @Param('id', ParseIntPipe) idPost: number,
  ) {
    return this.adminService.deletePost(idPost)
  }

  @Public()
  @Delete('/stories/:id')
  deleteStory(
    @Param('id', ParseIntPipe) idStory: number,
  ) {
    return this.adminService.deleteStory(idStory)
  }
}
