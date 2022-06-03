import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNegative,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MediaType } from 'src/constants';
import { UsersTagPostDto } from './users-tag-post-dto';

export class OptionFiles {
  @IsOptional()
  startTime: number;

  @IsOptional()
  endTime: number;

  @IsOptional()
  @IsBoolean()
  isMute: boolean;
  
  type: MediaType;

  @IsArray()
  @ValidateNested()
  @Type(() => UsersTagPostDto)
  tags: UsersTagPostDto[];
}
