import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  location: string;
}
