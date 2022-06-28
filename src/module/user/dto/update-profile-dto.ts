import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  bio: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  website: string;
}
