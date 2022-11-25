import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAminDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  account: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
