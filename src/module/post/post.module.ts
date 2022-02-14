import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { StoryRepository } from '../story/story.repository';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, Media, StoryRepository])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
