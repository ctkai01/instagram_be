import { User } from 'src/entities/auth.entity';
import { UserFollowResource } from './user-follow.resource';

export const UserFollowCollection = async (
  datas: User[],
  userAuth: User,
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserFollowResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
