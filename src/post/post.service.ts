import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/interface/response.interface';
import { PostResource } from 'src/resource/post/post.resource';
import { PostCollection } from './../resource/post/post.collection';
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

    const responseData: ResponseData = {
      data: PostResource(post),
      message: 'Create Post Successfully!',
    };
    return responseData;
  }

  async deletePost(idPost: number, userId: number): Promise<any> {
    const result = await this.postRepository.deletePost(idPost, userId);
    if (result) {
      const responseData: ResponseData = {
        message: 'Delete Post Successfully',
      };

      return responseData;
    }
  }

  async getListPostByUserId(idUser: number): Promise<ResponseData> {
    const listPost = await this.postRepository.getListPostByUser(idUser);

    if (listPost) {
      const responseData: ResponseData = {
        data: PostCollection(listPost),
        message: 'Get List Post Successfully',
      };

      return responseData;
    }
  }

  async getPost(idPost: number): Promise<ResponseData> {
    const post = await this.postRepository.getPost(idPost);
    if (post) {
      const responseData: ResponseData = {
        data: PostResource(post),
        message: 'Get Post Successfully',
      };
      return responseData;
    }
  }
}
