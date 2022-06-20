import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Query, UseFilters,
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
import { ActionCommentDto } from './dto/action-comment-dto';
import { CreateCommentDto } from './dto/create-comment-dto';

@Controller('comments')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  createComment(
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
    @Query('page') page: number,
  ) {
    return this.commentService.getCommentByPost(idPost, userAuth, page)
  }

  @Delete('/:id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() userAuth: User,

  ) {
    return this.commentService.deleteComment(id, userAuth);
  }

  @Post('/:id/react')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reactPost(
    @GetCurrentUser() userAuth: User,
    @Param('id', ParseIntPipe) idComment: number,
    @Body() actionCommentDto: ActionCommentDto,
  ) {
    return this.commentService.reactComment(idComment, actionCommentDto, userAuth);
  }
}
