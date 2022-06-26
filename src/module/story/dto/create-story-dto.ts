import { plainToClass, Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { TextStoryDto } from './text-story-dto';

export class CreateStoryDto {
  @IsOptional()
  // @IsArray()
  @ValidateNested({ each: true })
  @Transform(({value, key, obj, type }) => plainToClass(TextStoryDto, JSON.parse(value)))
  @Type(() => TextStoryDto)
  textStory?: TextStoryDto;
}
