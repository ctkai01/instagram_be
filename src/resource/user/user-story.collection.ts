import { User } from 'src/entities/auth.entity';
import { UserSimilarResource } from './user-similar.resource';
import { UserStoryResource } from './user-story.resource';

export const UserStoryCollection = async (datas: User[], userAuth: User): Promise<User[]> => {
  const userCollection = await Promise.all(
    datas.map(async (user: User): Promise<User> => {
      const userResource = await UserStoryResource(user, userAuth);
      return userResource;
    }),
  );

  return userCollection;
};
