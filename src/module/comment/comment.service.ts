import { take } from 'lodash';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { ResponseData } from 'src/interface';
import { CommentResource } from 'src/resource/comment/comment.resource';
import { UserRepository } from '../auth/auth.repository';
import { PostRepository } from '../post/post.repository';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment-dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userAuth: User,
    postId: number
  ): Promise<ResponseData> {

    const post = await this.postRepository.findOne(postId)
    if (!post) {
      throw new InternalServerErrorException('Post not found');
    }

    if (createCommentDto.parent_id) {
      const checkExistParentComment = await this.commentRepository.findOne(createCommentDto.parent_id)

      if (!checkExistParentComment) {
      throw new InternalServerErrorException('Parent id not found in');
      }
    }

    const comment = await this.commentRepository.createComment(createCommentDto, userAuth, post)

    const responseData: ResponseData = {
      data: await CommentResource(comment),
      message: 'Create comment Successfully!',
    };
    return responseData;
  }

  async getCommentByPost(
    postId: number,
    userAuth: User
  ): Promise<ResponseData> {

    const post = await this.postRepository.findOne(postId)
    if (!post) {
      throw new InternalServerErrorException('Post not found');
    }

    const comments = await this.commentRepository.getComments(post)
    // console.log(comment)

    const responseData: ResponseData = {
      data: comments,
      message: 'Get comments Successfully!',
    };
    return responseData;
  }
  
}
