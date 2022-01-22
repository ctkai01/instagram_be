import { CreatePostDto } from './dto/create-post-dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/auth/auth.entity';
import { UserRepository } from 'src/auth/auth.repository';
import { Logger } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaType } from './enum/media-enum';

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
}
