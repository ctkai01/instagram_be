import { plainToClass, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { OptionFiles } from './file-post-dto';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  location?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({value, key, obj, type }) => plainToClass(OptionFiles, JSON.parse(value)))
  @Type(() => OptionFiles)
  optionFiles: OptionFiles[] 
  
  @Transform(({value, key, obj, type }) => Boolean(+value))
  @IsBoolean()
  isHideLikeAndView: boolean;

  @Transform(({value, key, obj, type }) => Boolean(+value))
  @IsBoolean()
  isOffComment: boolean
}
