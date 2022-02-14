import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryRepository } from './story.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StoryRepository])],
  providers: [StoryService],
  controllers: [StoryController],
})
export class StoryModule {}
