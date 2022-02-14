import { IsEnum } from 'class-validator';
import { ActiveStatus } from '../../../constants/active-status';

export class ActionPostDto {
  @IsEnum(ActiveStatus)
  type: ActiveStatus;
}
