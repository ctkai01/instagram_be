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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer-config';
import { TransformInterceptor } from 'src/custom-response/core.response';
import { GetCurrentUserId } from 'src/decorators';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { AtGuard } from 'src/guards';
import { CreateStoryDto } from './dto/create-story-dto';
import { StoryService } from './story.service';

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
