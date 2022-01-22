import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, Media])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
