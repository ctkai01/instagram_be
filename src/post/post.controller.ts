import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/auth.entity';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { MulterConfig } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { HttpExceptionValidateFilter } from './../auth/exception/http-exception.filter';
import { CreatePostDto } from './dto/create-post-dto';
import { PostService } from './post.service';

@Controller('posts')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class PostController {
  private logger = new Logger();
  constructor(
    private postService: PostService,
    private config: ConfigService, // private multerConfig: MulterConfig,
  ) {}

  @UseInterceptors(
    FilesInterceptor(
      'files', // name of the field being passed
      10,
      new MulterConfig().options(),
    ),
  )
  @Post()
  createPost(
    @GetCurrentUserId() userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(createPostDto, userId, files);
  }

  @Delete('/:id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.postService.deletePost(id, userId);
  }

  @Get('/user/:id')
  postByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.postService.getListPostByUserId(userId);
  }

  @Get('/:id')
  getPostById(@Param('id', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Get()
  async getPost(
    @GetCurrentUser() userAuth: User,
    @Query('page', ParseIntPipe) pageNumber: number,
  ) {
    return this.postService.getPost(userAuth, pageNumber);
  }
}
