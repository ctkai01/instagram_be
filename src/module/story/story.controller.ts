import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { GetCurrentUser, GetCurrentUserId } from 'src/decorators';
import { User } from 'src/entities/auth.entity';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { CreateStoryDto } from './dto/create-story-dto';
import { StoryService } from './story.service';

@Controller('stories')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}
  @UseInterceptors(FileInterceptor('file', new MulterConfig().options()))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  createStory(
    @GetCurrentUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    return this.storyService.createStory(createStoryDto, userId, file);
  }

  @Post('/:id/view')
  createIsViewStory(
    @Param('id') idStory: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.storyService.createIsViewStory(idStory, userAuth);
  }

  @Get('/:id')
  getStory(
    @Param('id', ParseIntPipe) idStory: number,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.storyService.getStory(idStory, userAuth.id);
  }

  @Get('user/:user_name')
  getStoryByIdUser(
    @Param('user_name') userName: string,
    @GetCurrentUser() userAuth: User,
  ) {
    return this.storyService.getStoryByUserName(userName, userAuth);
  }
}
