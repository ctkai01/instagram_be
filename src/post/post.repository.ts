import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { NotFoundErrorCtor } from 'rxjs/internal/util/NotFoundError';
import { User } from 'src/auth/auth.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post-dto';
import { MediaType } from './enum/media-enum';
import { Media } from './media.entity';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  private logger = new Logger();
  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    files: Array<Express.Multer.File>,
  ) {
    const { caption, location } = createPostDto;

    try {
      const userRepository = this.manager.getRepository(User);
      const userAuth = await userRepository.findOne({ id: userId });

      const mediaEntityList = [];

      files.forEach((file) => {
        let type;
        if (file.mimetype.split('/')[0] === 'image') {
          type = MediaType.image;
        } else {
          type = MediaType.video;
        }

        const createEntityMedia = getRepository(Media).create({
          name: file.path.replace('\\', '\\'),
          type,
        });

        mediaEntityList.push(createEntityMedia);
      });

      const data: Post = {
        caption,
        location,
        user: userAuth,
        media: mediaEntityList,
      };
      const post = this.create(data);

      const postCreated = await this.save(post);
      const mediaEntityNewList = mediaEntityList.map((mediaEntity: Media) => {
        return {
          ...mediaEntity,
          post: postCreated,
        };
      });
      await getRepository(Media).save(mediaEntityNewList);
      return postCreated;
    } catch (err) {
      console.log(err);
    }
  }

  async deletePost(idPost: number, userId: number) {
    const post = await this.findOne({
      where: { id: idPost },
      relations: ['user', 'media'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const checkUseBelongPost = post.user.id === userId;

    if (!checkUseBelongPost) {
      throw new ForbiddenException('You cannot delete this post');
    }

    try {
      const result = await this.remove(post);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getListPostByUser(userId: number): Promise<Post[]> {
    try {
      const listPost = await this.find({
        where: { created_by: userId },
        relations: ['media'],
      });
      return listPost;
    } catch (err) {
      console.log(err);
    }
  }

  async getPost(postId: number): Promise<any> {
    const post = await this.findOne({
      where: { id: postId },
      relations: ['media', 'user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
