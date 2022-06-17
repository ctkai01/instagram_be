import { User } from 'src/entities/auth.entity';
import { UserSimilarResource } from './user-similar.resource';

export const UserSimilarCollection = async (
  datas: User[],
  userAuth: User,
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserSimilarResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
