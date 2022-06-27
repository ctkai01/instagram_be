import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { ResponseData } from 'src/interface/response.interface';
import { StoryResource } from 'src/resource/story/story.resource';
import { UserStoryResource } from 'src/resource/user/user-story.resource';
import { getRepository } from 'typeorm';
import { UserRepository } from '../auth/auth.repository';
import { CreateStoryDto } from './dto/create-story-dto';
import { StoryRepository } from './story.repository';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryRepository)
    private storyRepository: StoryRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
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
      data: StoryResource(story, userId),
      message: 'Create Story Successfully!',
    };
    return responseData;
  }

  async getStory(idStory: number, idAuth): Promise<ResponseData> {
    const story = await this.storyRepository.getStory(idStory);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const responseData: ResponseData = {
      data: StoryResource(story, idAuth),
      message: 'Get Story Successfully!',
    };
    return responseData;
    
  }

  async getStoryByUserName(userName: string, userAuth: User): Promise<ResponseData> {
    const user = await getRepository(User).findOne({ where: {
      user_name: userName
    }});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userStory = await this.userRepository.getStoryByUserName(userName);
   
    const responseData: ResponseData = {
      data: await UserStoryResource(userStory, userAuth),
      message: 'Get Story Successfully!',
    };
    return responseData;
  }

  async createIsViewStory(idStory: number, userAuth: User): Promise<ResponseData>{
    const story = await this.storyRepository.findOne(idStory, {relations: ['user']});
    if (!story) {
      throw new InternalServerErrorException('Story not found');
    }

    const storyUser = await this.storyRepository.createView(userAuth, story);

 

    const userCreatedStoryUpdate = await this.userRepository.getStoryByUserName(story.user.user_name);
   
    if (storyUser) {
      const responseData: ResponseData = {
        data:  await UserStoryResource(userCreatedStoryUpdate, userAuth),
        message: 'Create view story success'
      
      };

      return responseData;
    }
  }


 
}
