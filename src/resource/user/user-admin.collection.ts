import { User } from 'src/entities/auth.entity';
import { UserAdminResource } from './user-admin.resource';

export const UserAdminCollection = async (
  datas: User[],
): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserAdminResource(user);
      return userResource;
    }),
  );

  return userCollection;
};
