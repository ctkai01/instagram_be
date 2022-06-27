import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password_old: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password_new: string;
}
