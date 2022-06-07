import { Transform } from "class-transformer";
import { FollowStatus } from "src/constants";

export class FollowUserDto {
  @Transform(({value, key, obj, type }) => +value)
  type: FollowStatus.FOLLOW | FollowStatus.UN_FOLLOW;
}
