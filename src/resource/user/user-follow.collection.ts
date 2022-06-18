import { User } from 'src/entities/auth.entity';
import { UserFollowResource } from './user-follow.resource';

export const UserFollowCollection = async (
  datas: User[],
  userAuth: User,
  reversePost: boolean = false
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserFollowResource(user, userAuth, reversePost);
      return userResource;
    }),
  );

  return userCollection;
};
