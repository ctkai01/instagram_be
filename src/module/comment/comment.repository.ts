import { ActiveStatus, MediaType } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { CommentUser } from 'src/entities/comment-user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { Story } from 'src/entities/story.entity';
import { Pagination } from 'src/interface';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment-dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  // async createStory(
  //   createStoryDto: CreateStoryDto,
  //   userId: number,
  //   file: Express.Multer.File,
  // ): Promise<any> {

  // }

  async createComment(
    createCommentDto: CreateCommentDto,
    userAuth: User,
    post: Post,
  ): Promise<Comment> {
    const { content, parent_id } = createCommentDto;

    try {
      const data: Comment = {
        content: content,
        parent_id: parent_id ? parent_id : null,
        post,
        user: userAuth,
      };

      const comment = this.create(data);
      const commentCreated = await this.save(comment);
      return commentCreated;
    } catch (err) {
      console.log(err);
    }
  }

  async getComments(post: Post, pagination: Pagination): Promise<Comment[]> {
    const { skip, take } = pagination;
    try {
      const comments = await this.find({
        where: { post_id: post.id },
        relations: [
          'user',
          'post',
          'user.posts',
          'user.posts.media',
          'childComments',
          'childComments.user',
          'childComments.user.posts',
          'childComments.user.posts.media',
        ],
        skip,
        take,
      });

      return comments;
    } catch (err) {
      console.log(err);
    }
  }

  async getCommentUser(idUser: number, idComment: number) {
    try {
      const postUser = await getRepository(CommentUser).findOne({
        where: { comment_id: idComment, user_id: idUser },
      });

      return postUser;
    } catch (err) {
      console.log(err);
    }
  }

  async reactComment(
    userAuth: User,
    comment: Comment,
    statusLikeAction: ActiveStatus,
    commentUser: CommentUser | undefined,
  ) {
    try {
      if (!commentUser) {
        const commentUser = new CommentUser();
        commentUser.is_like = statusLikeAction;
        commentUser.comment = comment;
        commentUser.user = userAuth;
        const commentUserCreated = getRepository(CommentUser).save(commentUser);
        return commentUserCreated;
      } else {
        commentUser.is_like = statusLikeAction;
        commentUser.updated_at = new Date().toISOString();
        const postUserUpdate = getRepository(CommentUser).save(commentUser);
        return postUserUpdate;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getCommentById(commentId: number): Promise<Comment> {
    try {
      const comment = await this.findOne({
        where: { id: commentId },
      });
      return comment;
    } catch (err) {
      console.log(err);
    }
  }
}
