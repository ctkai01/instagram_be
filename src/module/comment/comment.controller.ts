import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { GetCurrentUser } from 'src/decorators';
import { User } from 'src/entities/auth.entity';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment-dto';

@Controller('comments')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  createStory(
    @Param('id', ParseIntPipe) idPost: number,
    @GetCurrentUser() userAuth: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(createCommentDto, userAuth, idPost)
  }

  @Get('/:id/post')
  commentByPostId(
    @Param('id', ParseIntPipe) idPost: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.commentService.getCommentByPost(idPost, userAuth)
  }

  // @Get('/:id')
  // getStory(@Param('id', ParseIntPipe) idStory: number) {
  //   return this.storyService.getStory(idStory);
  // }

  // @Get('user/:id')
  // getStoryByIdUser(@Param('id', ParseIntPipe) idUser: number) {
  //   return this.storyService.getStoryByIdUser(idUser);
  // }
}
