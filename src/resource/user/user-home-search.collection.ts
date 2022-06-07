import { User } from 'src/entities/auth.entity';
import { UserHomeSearchResource } from './user-home-search.resource';

export const UserHomeSearchCollection = async (
  datas: User[],
  userAuth: User,
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserHomeSearchResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
