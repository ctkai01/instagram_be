import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { GetCurrentUser, GetCurrentUserId } from 'src/decorators';
import { AtGuard } from 'src/guards';
import { MulterConfig } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { ActionPostDto } from './dto/action-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { PostService } from './post.service';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { User } from 'src/entities/auth.entity';

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
    FileFieldsInterceptor([
      {
        name: 'files',
        maxCount: 10,
      },
      {
        name: 'coverFiles',
        maxCount: 10,
      },
    ], new MulterConfig().options()),
    // FilesInterceptor(
    //   'files', // name of the field being passed
    //   10,
    //   new MulterConfig().options(),
    // ),
  )
  @Post()
  createPost(
    @GetCurrentUser() userAuth: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @UploadedFiles() coverFiles: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
  ) {
    console.log('Data', createPostDto)
    console.log('Files', files)
    console.log('Cover', coverFiles)
    // return this.postService.createPost(createPostDto, userAuth, files);
  }

  @Delete('/:id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.postService.deletePost(id, userId);
  }

  @Get('/user/:id')
  postByUserId(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.postService.getListPostByUserId(userId, userAuth);
  }

  @Get('/:id')
  getPostById(
    @Param('id', ParseIntPipe) postId: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.postService.getPostById(postId, userAuth);
  }

  @Get()
  async getPost(
    @GetCurrentUser() userAuth: User,
    @Query('page', ParseIntPipe) pageNumber: number,
  ) {
    return this.postService.getPost(userAuth, pageNumber);
  }

  @Post('/:id/react')
  @HttpCode(HttpStatus.OK)
  async reactPost(
    @GetCurrentUser() userAuth: User,
    @Param('id', ParseIntPipe) idPost: number,
    @Body() actionPostDto: ActionPostDto,
  ) {
    return this.postService.reactPost(idPost, actionPostDto, userAuth);
  }
}
