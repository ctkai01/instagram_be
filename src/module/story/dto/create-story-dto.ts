import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { TextStoryDto } from './text-story-dto';

export class CreateStoryDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TextStoryDto)
  textJson?: TextStoryDto[];
}
