import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveStatus, ActivityStatus } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { Pagination } from 'src/interface/pagination.interface';
import { ResponseData } from 'src/interface/response.interface';
import { PostHomeCollection } from 'src/resource/post/post-home.collection';
import { PostHomeResource } from 'src/resource/post/post-home.resource';
import { PostReactResource } from 'src/resource/post/post-react.resource';
import { PostReviewCollection } from 'src/resource/post/post-review.collection';
import { PostCollection } from 'src/resource/post/post.collection';
import { PostResource } from 'src/resource/post/post.resource';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';
import { getRepository } from 'typeorm';
import { ActionPostDto } from './dto/action-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
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
    userAuth: User,
    fileUpload: Array<Express.Multer.File>,
    filesNameUploadTrim: string[],
    filesCover: Array<Express.Multer.File>,
  ): Promise<any> {
    const post = await this.postRepository.createPost(
      createPostDto,
      userAuth.id,
      fileUpload,
      filesNameUploadTrim,
      filesCover,
    );

    const responseData: ResponseData = {
      data: await PostResource(post, userAuth),
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

  async deletePostAdmin(idPost: number): Promise<any> {
    const result = await this.postRepository.deletePostAdmin(idPost);
    if (result) {
      const responseData: ResponseData = {
        message: 'Delete Post Successfully',
      };

      return responseData;
    }
  }

  async getListPostByUserId(
    idUser: number,
    userAuth: User,
  ): Promise<ResponseData> {
    const listPost = await this.postRepository.getListPostByUser(idUser);

    if (listPost) {
      const responseData: ResponseData = {
        data: PostCollection(listPost, userAuth),
        message: 'Get List Post Successfully',
      };

      return responseData;
    }
  }

  async getPostById(idPost: number, userAuth: User): Promise<ResponseData> {
    const post = await this.postRepository.getPostById(idPost);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post) {
      const responseData: ResponseData = {
        data: await PostResource(post, userAuth),
        message: 'Get Post Successfully',
      };
      return responseData;
    }
  }

  async getPostApprove(pageNumber: number) {
    const posts = (await this.postRepository.getAllPostNotApprove()).sort(function (
      postA,
      postB,
    ) {
      return postA.created_at > postB.created_at
        ? -1
        : postA.created_at < postB.created_at
        ? 1
        : 0;
    });

    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    let postsPaginate;
    let count;

    [postsPaginate, count] = new Post().getPostCountPaginate(
      posts,
      pagination,
    );
    const postsCollection = await PostReviewCollection(postsPaginate)

    const responseData: ResponseData = {
      data: paginateResponse([postsCollection, count], page, take),
      message: 'Get Post Successfully',
    };

    return responseData;
  }

  async getPost(userAuth: User, pageNumber: number): Promise<any> {
    let idsUserFollowing = await userAuth.getFollowing();
    idsUserFollowing.push(userAuth.id);
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

    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    let postsPaginate;
    let count;
    if (idsUserFollowing.length === 1) {
      const postsShow = posts.filter((post: Post) =>
      post.created_by === userAuth.id,
    );

      [postsPaginate, count] = new Post().getPostCountPaginate(
        postsShow,
        pagination,
      );
    } else {
      const postsShow = posts.filter((post: Post) =>
        idsUserFollowing.includes(post.created_by as number),
      );

      [postsPaginate, count] = new Post().getPostCountPaginate(
        postsShow,
        pagination,
      );
    }

    const postCollection = await PostHomeCollection(postsPaginate, userAuth);

    const responseData: ResponseData = {
      data: paginateResponse([postCollection, count], page, take),
      message: 'Get Post Successfully',
    };
    return responseData;
  }

  async reactPost(
    idPost: number,
    actionPostDto: ActionPostDto,
    userAuth: User,
  ): Promise<ResponseData> {
    const post = await this.postRepository.getPostById(idPost);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const postUser = await this.postRepository.getPostUser(userAuth.id, idPost);
    if (postUser && postUser.is_like === actionPostDto.type) {
      if (actionPostDto.type === ActiveStatus.ACTIVE) {
        throw new InternalServerErrorException('Can not like post');
      } else {
        throw new InternalServerErrorException('Can not unlike post');
      }
    }

    const result = await this.postRepository.reactPost(
      userAuth,
      post,
      actionPostDto.type,
      postUser,
    );
    const postUpdate = await this.postRepository.getPostById(idPost);

    if (result) {
      const responseData: ResponseData = {
        data: await PostReactResource(postUpdate, userAuth),
        message:
          actionPostDto.type === ActiveStatus.ACTIVE
            ? 'Like post Successfully'
            : 'Unlike post Successfully',
      };

      return responseData;
    }
  }

  async acceptPostReview(idPost: number) {
    const post: Post = await this.postRepository.getPostById(idPost);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status === ActiveStatus.ACTIVE) {
      throw new InternalServerErrorException('Can not accept post active');
    }

    post.status = ActiveStatus.ACTIVE
    getRepository(Post).save(post)
    const responseData: ResponseData = {
      message: 'Accept Post Successfully',
    };
    return responseData
  }
}
