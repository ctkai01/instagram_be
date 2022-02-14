import { User } from 'src/auth/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: User = {
    ...data,
    posts: PostCollection(data.posts),
    avatar: name,
    is_following: await userAuth.isFollowing(data),
    count_follower: await data.countFollowerUser(),
    count_following: await data.countFollowingUser(),
  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
