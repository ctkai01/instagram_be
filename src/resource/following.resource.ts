import { User } from 'src/auth/auth.entity';
import { UserCollection } from './user/user.collection';

export const FollowingResource = (datas: User[], userAuth: User) => {
  const dataTransform = UserCollection(datas, userAuth);

  return dataTransform;
};
