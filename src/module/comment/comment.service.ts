import { take } from 'lodash';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { Pagination, ResponseData } from 'src/interface';
import { CommentResource } from 'src/resource/comment/comment.resource';
import { UserRepository } from '../auth/auth.repository';
import { PostRepository } from '../post/post.repository';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment-dto';
import { CommentController } from './comment.controller';
import { CommentCollection } from 'src/resource/comment/comment.collection';
import { ConfigService } from '@nestjs/config';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';
import { ActionCommentDto } from './dto/action-comment-dto';
import { ActiveStatus } from 'src/constants';
import { CommentReactResource } from 'src/resource/comment/comment-react.resource';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userAuth: User,
    postId: number,
  ): Promise<ResponseData> {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new InternalServerErrorException('Post not found');
    }

    if (createCommentDto.parent_id) {
      const checkExistParentComment = await this.commentRepository.findOne(
        createCommentDto.parent_id,
      );

      if (!checkExistParentComment) {
        throw new InternalServerErrorException('Parent id not found in');
      }
    }
    const userCreated = await this.userRepository.findOne(userAuth.id, {
      relations: ['posts', 'posts.media'],
    });

    const comment = await this.commentRepository.createComment(
      createCommentDto,
      userCreated,
      post,
    );

    comment.childComments = []
    const responseData: ResponseData = {
      data: await CommentResource(comment, userAuth),
      message: 'Create comment Successfully!',
    };
    return responseData;
  }

  async getCommentByPost(
    postId: number,
    userAuth: User,
    pageNumber: number,
  ): Promise<ResponseData> {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new InternalServerErrorException('Post not found');
    }

    let [take, page, skip] = calcPaginate(
      this.configService.get('comment.take'),
      +pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    const comments = await this.commentRepository.getComments(post, pagination);
    const count = comments.length
    const dataComments = await CommentCollection(comments, userAuth);
    const responseData: ResponseData = {
      data: paginateResponse([dataComments, count], page, take),
      message: 'Get comments Successfully!',
    };
    return responseData;
  }

  async deleteComment(
    commentId: number,
    userAuth: User,
  ): Promise<ResponseData> {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment) {
      throw new InternalServerErrorException('Comment not found');
    }

    if (comment.created_by !== userAuth.id) {
      throw new ForbiddenException('Not permission');
    }

    const result = await this.commentRepository.remove(comment)

    if (result) {
      const responseData: ResponseData = {
        message: 'Delete comment Successfully',
      };

      return responseData;
    }
  }

  async reactComment(
    idComment: number,
    actionCommentDto: ActionCommentDto,
    userAuth: User,
  ): Promise<ResponseData> {
    const comment = await this.commentRepository.findOne(idComment);
    if (!comment) {
      throw new InternalServerErrorException('Comment not found');
    }
    const commentUser = await this.commentRepository.getCommentUser(userAuth.id, idComment);
    if (commentUser && commentUser.is_like === actionCommentDto.type) {
      if (actionCommentDto.type === ActiveStatus.ACTIVE) {
        throw new InternalServerErrorException('Can not like comment');
      } else {
        throw new InternalServerErrorException('Can not unlike comment');
      }
    }

    const result = await this.commentRepository.reactComment(
      userAuth,
      comment,
      actionCommentDto.type,
      commentUser,
    );
    const commentUpdate = await this.commentRepository.getCommentById(idComment);

    if (result) {
      const responseData: ResponseData = {
        data: await CommentReactResource(commentUpdate, userAuth),
        message:
        actionCommentDto.type === ActiveStatus.ACTIVE
            ? 'Like comment Successfully'
            : 'Unlike comment Successfully',
      };

      return responseData;
    }
  }
  
}
