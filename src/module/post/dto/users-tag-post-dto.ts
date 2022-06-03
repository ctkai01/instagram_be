import { IsEnum, IsOptional } from 'class-validator';
import { ActiveStatus } from '../../../constants/active-status';

export class UsersTagPostDto {
  @IsOptional()
  x?: number;
  @IsOptional()
  y?: number;
  user_name: string;
  full_name: string;
}
