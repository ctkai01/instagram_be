import {
  Body,
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { AppConfig } from 'src/config/app.config';
import { multerOptions } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { HttpExceptionValidateFilter } from './../auth/exception/http-exception.filter';
import { CreatePostDto } from './dto/create-post-dto';
import { PostService } from './post.service';
// import from './test';

@Controller('posts')
export class PostController {
  private logger = new Logger();
  constructor(
    private postService: PostService,
    private config: ConfigService,
  ) {}

  @UseGuards(AtGuard)
  @UseFilters(new HttpExceptionValidateFilter())
  @UseInterceptors(TransformInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      'files', // name of the field being passed
      10,
      multerOptions.post,
    ),
  )
  @Post()
  async createPost(
    @GetCurrentUserId() userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
  ) {
    console.log('Files: ', AppConfig.get('upload'));

    // console.log('PATH', __dirname);
    // console.log(configApp, 'PATH1');
    // console.log(process.env.UPLOAD_POST, 'PATH2');
    // console.log(this.config.get('upload'), 'PATH3');
    return this.postService.createPost(createPostDto, userId, files);
  }
}
