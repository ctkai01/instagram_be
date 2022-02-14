import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
import { PostHomeCollection } from 'src/resource/post/post-home.collection';
import { PostResource } from 'src/resource/post/post.resource';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';
import { PostCollection } from './../resource/post/post.collection';
import { CreatePostDto } from './dto/create-post-dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  private logger = new Logger('PostService');
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    private configService: ConfigService,
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

  async getPostById(idPost: number): Promise<ResponseData> {
    const post = await this.postRepository.getPostById(idPost);
    if (post) {
      const responseData: ResponseData = {
        data: PostResource(post),
        message: 'Get Post Successfully',
      };
      return responseData;
    }
  }

  async getPost(userAuth: User, pageNumber: number): Promise<any> {
    const idsUserNotShow = await userAuth.idsNotFollowingAndBlockUser();
    const posts = (await this.postRepository.getAllPost()).sort(function (
      postA,
      postB,
    ) {
      return postA.created_at > postB.created_at
        ? -1
        : postA.created_at < postB.created_at
        ? 1
        : 0;
    });

    const postsShow = posts.filter(
      (post: Post) => !idsUserNotShow.includes(post.created_by as number),
    );

    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    const [postsPaginate, count] = new Post().getPostCountPaginate(
      postsShow,
      pagination,
    );

    const postCollection = await PostHomeCollection(postsPaginate, userAuth);

    const responseData: ResponseData = {
      data: paginateResponse([postCollection, count], page, take),
      message: 'Get Post Successfully',
    };
    return responseData;
  }
}
