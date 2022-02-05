import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryModule } from 'src/story/story.module';
import { StoryRepository } from 'src/story/story.repository';
import { Media } from './media.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, Media, StoryRepository])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
