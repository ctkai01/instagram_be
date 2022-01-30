import { User } from 'src/auth/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  const dataTransform: User = {
    ...data,
    posts: PostCollection(data.posts),
    is_following: await userAuth.isFollowing(data),
    countFollower: await data.countFollowerUser(),
    countFollowing: await data.countFollowingUser(),
  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
