import { User } from 'src/entities/auth.entity';
import { UserSearchResource } from './user-search.resource';
import { UserResource } from './user.resource';

export const UserSearchCollection = async (
  datas: User[],
  userAuth: User
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserSearchResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
