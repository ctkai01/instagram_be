import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(255)

  content: string;
  
  @IsOptional()
  @Transform(({value, key, obj, type }) => +value)
  @IsNumber()
  parent_id?: number;
}
