import { MediaType } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { Story } from 'src/entities/story.entity';
import { EntityRepository, Repository } from 'typeorm';
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

  async getComments(post: Post): Promise<Comment[]> {
    try {
      const comment = await this.find({
        where: { post_id: post.id },
        relations: ['user', 'post', 'user.posts', 'user.posts.media'],
      });

      console.log(comment)
      // const comment = await this
      // .createQueryBuilder('comments')
      // .leftJoin('users.follower', 'relations')
      // .where('comments.post_id = :userId', { userId: this.id })
      // .getCount();

      return comment;
    } catch (err) {
      console.log(err);
    }
  }
}
