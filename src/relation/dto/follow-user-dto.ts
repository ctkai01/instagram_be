import { FollowStatus } from 'src/post/enum/follow-status.enum';

export class FollowUserDto {
  type: FollowStatus.FOLLOW | FollowStatus.UN_FOLLOW;
}
