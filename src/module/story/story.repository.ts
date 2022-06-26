import { MediaType } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { Story } from 'src/entities/story.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story-dto';

@EntityRepository(Story)
export class StoryRepository extends Repository<Story> {
  async createStory(
    createStoryDto: CreateStoryDto,
    userId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const { textStory } = createStoryDto;

    try {
      const userRepository = this.manager.getRepository(User);
      const userAuth = await userRepository.findOne({ id: userId });
      let typeMedia: MediaType;
      if (file.mimetype.split('/')[0] === 'image') {
        typeMedia = MediaType.image;
      } else {
        typeMedia = MediaType.video;
      }
      const data: Story = {
        media: file.path.replace('\\', '\\'),
        text_json: textStory ? textStory : null,
        user: userAuth,
        typeMedia,
      };
      const story = this.create(data);

      const storyCreated = await this.save(story);

      return storyCreated;
    } catch (err) {
      console.log(err);
    }
  }

  async getStory(idStory: number): Promise<Story> {
    try {
      const post = await this.findOne(idStory, { relations: ['user'] });
      return post;
    } catch (err) {
      console.log(err);
    }
  }

  async getStoryByIdUser(idUser: number): Promise<Story[]> {
    try {
      const posts = await this.find({
        where: { created_by: idUser },
      });

      return posts;
    } catch (err) {
      console.log(err);
    }
  }
}
