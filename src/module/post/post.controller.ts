import { path } from '@ffmpeg-installer/ffmpeg';
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
  Query, UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FileFieldsInterceptor
} from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { GetCurrentUser, GetCurrentUserId } from 'src/decorators';
import { User } from 'src/entities/auth.entity';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { ffmpegSync } from 'src/untils/until';
import { ActionPostDto } from './dto/action-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { PostService } from './post.service';
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(path);
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
    FileFieldsInterceptor(
      [
        {
          name: 'files',
          maxCount: 10,
        },
        {
          name: 'coverFiles',
          maxCount: 10,
        },
      ],
      new MulterConfig().options(),
    ),
    // FilesInterceptor(
    //   'files', // name of the field being passed
    //   10,
    //   new MulterConfig().options(),
    // ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createPost(
    @GetCurrentUser() userAuth: User,
    @UploadedFiles()
    files: { files: Express.Multer.File[]; coverFiles: Express.Multer.File[] },
    @Body() createPostDto: CreatePostDto,
  ) {
   
    const fileUpload = files.files;
    const filesNameUploadTrim = await Promise.all(
      fileUpload.filter(file => file.mimetype === 'video/mp4').map(async (file, index) => {
          const startTime = createPostDto.optionFiles[index].startTime;
          const endTime = createPostDto.optionFiles[index].endTime;
          return await ffmpegSync(file, index, startTime, endTime);
      }),
    );
   
    return this.postService.createPost(createPostDto, userAuth, fileUpload, filesNameUploadTrim, files.coverFiles);
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
