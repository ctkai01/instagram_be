import { FollowStatus } from "src/constants";

export class FollowUserDto {
  type: FollowStatus.FOLLOW | FollowStatus.UN_FOLLOW;
}
