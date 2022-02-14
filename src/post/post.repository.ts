import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/auth.entity';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic';
import { CreatePostDto } from './dto/create-post-dto';
import { MediaType } from './enum/media-enum';
import { Media } from './media.entity';
import { MediaRepository } from './media.repository';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  private logger = new Logger();
  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    files: Array<Express.Multer.File>,
  ): Promise<Post> {
    const { caption, location } = createPostDto;

    try {
      const userRepository = this.manager.getRepository(User);
      const userAuth = await userRepository.findOne({ id: userId });
      const mediaEntityList = [];

      const data: Post = {
        caption,
        location,
        user: userAuth,
      };
      files.forEach((file) => {
        let type: MediaType;
        if (file.mimetype.split('/')[0] === 'image') {
          type = MediaType.image;
        } else {
          type = MediaType.video;
        }
        const createEntityMedia = this.manager.getRepository(Media).create({
          name: file.path.replace('\\', '\\'),
          type,
        });
        mediaEntityList.push(createEntityMedia);
      });
      data['media'] = mediaEntityList;

      const post = this.create(data);
      const postCreated = await this.save(post);

      const mediaEntityNewList = mediaEntityList.map((mediaEntity: Media) => {
        return {
          ...mediaEntity,
          post: postCreated,
        };
      });
      await this.manager.getRepository(Media).save(mediaEntityNewList);
      return postCreated;
    } catch (err) {
      console.log(err);
    }
  }

  async deletePost(idPost: number, userId: number) {
    const post = await this.findOne({
      where: { id: idPost },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const checkUseBelongPost = post.user.id === userId;

    if (!checkUseBelongPost) {
      throw new ForbiddenException('You cannot delete this post');
    }

    try {
      const resultDeletePost = await this.remove(post);

      return Boolean(resultDeletePost);
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

  async getPostById(postId: number): Promise<any> {
    const post = await this.findOne({
      where: { id: postId },
      relations: ['media', 'user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getAllPost(): Promise<Post[]> {
    try {
      const posts = await this.find({
        relations: ['user', 'media'],
      });
      return posts;
    } catch (err) {
      console.log(err);
    }
  }
}
