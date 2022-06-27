import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryRepository } from './story.repository';
import { UserRepository } from '../auth/auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StoryRepository, UserRepository])],
  providers: [StoryService],
  controllers: [StoryController],
})
export class StoryModule {}
