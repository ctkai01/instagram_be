import { User } from 'src/entities/auth.entity';

export const UserHomeResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: User = {
    ...data,
    avatar: name,
    is_following: await userAuth.isFollowing(data),
    count_follower: await data.countFollowerUser(),
    count_following: await data.countFollowingUser(),
    view_all_story: await data.getViewAll(userAuth)
  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
