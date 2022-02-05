import { User } from 'src/auth/auth.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/interface/response.interface';
import { StoryResource } from 'src/resource/story/story.resource';
import { getRepository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story-dto';
import { Story } from './story.entity';
import { StoryRepository } from './story.repository';
import { StoryCollection } from 'src/resource/story/story.collection';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryRepository)
    private storyRepository: StoryRepository,
  ) {}

  async createStory(
    createStoryDto: CreateStoryDto,
    userId: number,
    file: Express.Multer.File,
  ): Promise<ResponseData> {
    const story = await this.storyRepository.createStory(
      createStoryDto,
      userId,
      file,
    );
    const responseData: ResponseData = {
      data: StoryResource(story),
      message: 'Create Story Successfully!',
    };
    return responseData;
  }

  async getStory(idStory: number): Promise<ResponseData> {
    const story = await this.storyRepository.getStory(idStory);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const responseData: ResponseData = {
      data: StoryResource(story),
      message: 'Get Story Successfully!',
    };
    return responseData;
  }

  async getStoryByIdUser(idUser: number): Promise<ResponseData> {
    const user = getRepository(User).findOne(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const stories = await this.storyRepository.getStoryByIdUser(idUser);

    const responseData: ResponseData = {
      data: StoryCollection(stories),
      message: 'Get Story Successfully!',
    };
    return responseData;
  }
}
