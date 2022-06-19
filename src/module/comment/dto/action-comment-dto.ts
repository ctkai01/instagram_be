import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ActiveStatus } from '../../../constants/active-status';

export class ActionCommentDto {
  @Transform(({value, key, obj, type }) => +value)
  @IsEnum(ActiveStatus)
  type: ActiveStatus;
}
