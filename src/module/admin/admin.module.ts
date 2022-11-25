import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PostModule } from '../post/post.module';
import { StoryModule } from '../story/story.module';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRepository]), AuthModule, PostModule, StoryModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
