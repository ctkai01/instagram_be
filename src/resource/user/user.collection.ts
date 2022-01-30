import { User } from 'src/auth/auth.entity';
import { UserResource } from './user.resource';

export const UserCollection = async (
  datas: User[],
  userAuth: User,
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
