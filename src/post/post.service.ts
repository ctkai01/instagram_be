import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/auth/interface/response.interface';
import { PostResource } from 'src/resource/post/post.resource';
import { CreatePostDto } from './dto/create-post-dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  private logger = new Logger('PostService');
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    const post = await this.postRepository.createPost(
      createPostDto,
      userId,
      files,
    );
    const t = PostResource(post);
    this.logger.verbose(`Data: ${JSON.stringify(t, null, 2)}`);

    const responseData: ResponseData = {
      data: {
        post: t,
      },
      message: 'Create Post Successfully!',
    };

    return responseData;
  }
}
