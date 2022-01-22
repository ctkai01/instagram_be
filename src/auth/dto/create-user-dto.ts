import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsPhoneOrEmail } from '../validate/IsPhoneOrEmail';
import { IsUniqueUserName } from '../validate/IsUniqueUserName';

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  full_name: string;

  @IsOptional()
  @IsPhoneOrEmail({ message: 'Email or phone is invalid!' })
  account: string;

  @IsString()
  @IsUniqueUserName({ message: 'Username already exist!' })
  @MinLength(8)
  @MaxLength(32)
  user_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
