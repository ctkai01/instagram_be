import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { x } from 'joi';
import { ActiveStatus, MediaType } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { Media } from 'src/entities/media.entity';
import { PostUser } from 'src/entities/post-user.entity';
import { Post } from 'src/entities/post.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post-dto';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  private logger = new Logger();
  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    fileUpload: Array<Express.Multer.File>,
    filesNameUploadTrim: string[],
    filesCover:  Array<Express.Multer.File>
  ): Promise<Post> {
    const { caption, location, isHideLikeAndView, isOffComment, optionFiles } = createPostDto;
    // optionFiles[0].tags[0].
    console.log('Location', location)
    try {
      const userRepository = this.manager.getRepository(User);
      const userAuth = await userRepository.findOne({ id: userId });
      const mediaEntityList = [];
      console.log('hide', isHideLikeAndView)
      console.log('comment', isOffComment)
      const data: Post = {
        caption,
        location,
        user: userAuth,
        is_hide_like_view: isHideLikeAndView ? ActiveStatus.ACTIVE : ActiveStatus.NO_ACTIVE,
        is_off_comment: isOffComment ? ActiveStatus.ACTIVE : ActiveStatus.NO_ACTIVE,

      };
      let indexVideo = 0
      fileUpload.forEach((file, index) => {
        let type: MediaType;
        let namePath: string;
        let coverPath: string;
        let isMute: ActiveStatus;
        if (file.mimetype.split('/')[0] === 'image') {
          type = MediaType.image;
          namePath = file.path.replace('\\', '\\')
        } else {
          type = MediaType.video;
          namePath = filesNameUploadTrim[indexVideo].replace('\\', '\\')
          coverPath = filesCover[indexVideo].path.replace('\\', '\\')
          isMute = optionFiles[index].isMute ? ActiveStatus.ACTIVE : ActiveStatus.NO_ACTIVE
          indexVideo++
        }
        console.log('Cover', coverPath)
        const tagUser = optionFiles[index].tags.map(tag => {
          delete tag['url']
          return tag
        })
        const dataMedia: Media = {
          name: namePath,
          type,
          cover_name: coverPath,
          tags_user: tagUser,
          is_mute: isMute
        }

        const createEntityMedia = this.manager.getRepository(Media).create(dataMedia);
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
    try {
      const post = await this.findOne({
        where: { id: postId },
        relations: ['media', 'user'],
      });
      return post;
    } catch (err) {
      console.log(err);
    }
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

  async reactPost(
    userAuth: User,
    post: Post,
    statusLikeAction: ActiveStatus,
    postUser: PostUser | undefined,
  ) {
    try {
      if (!postUser) {
        const postUser = new PostUser();
        postUser.is_like = statusLikeAction;
        postUser.post = post;
        postUser.user = userAuth;
        const postUserCreated = getRepository(PostUser).save(postUser);
        return postUserCreated;
      } else {
        postUser.is_like = statusLikeAction;
        postUser.updated_at = new Date().toISOString();
        const postUserUpdate = getRepository(PostUser).save(postUser);
        return postUserUpdate;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getPostUser(idUser: number, idPost: number) {
    try {
      const postUser = await getRepository(PostUser).findOne({
        where: { post_id: idPost, user_id: idUser },
      });

      return postUser;
    } catch (err) {
      console.log(err);
    }
  }
}
