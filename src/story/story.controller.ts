import { AtGuard } from './../common/guards/at.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { HttpExceptionValidateFilter } from 'src/auth/exception/http-exception.filter';
import { StoryService } from './story.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateStoryDto } from './dto/create-story-dto';
import { MulterConfig } from 'src/config/multer-config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('story')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
@UseGuards(AtGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}
  @UseInterceptors(FileInterceptor('file', new MulterConfig().options()))
  @Post()
  createStory(
    @GetCurrentUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    return this.storyService.createStory(createStoryDto, userId, file);
  }

  @Get('/:id')
  getStory(@Param('id', ParseIntPipe) idStory: number) {
    return this.storyService.getStory(idStory);
  }

  @Get('user/:id')
  getStoryByIdUser(@Param('id', ParseIntPipe) idUser: number) {
    return this.storyService.getStoryByIdUser(idUser);
  }
}
