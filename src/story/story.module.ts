import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryRepository } from './story.repository';
import { Media } from 'src/post/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoryRepository])],
  providers: [StoryService],
  controllers: [StoryController],
})
export class StoryModule {}
