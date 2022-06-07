import { FollowStatus } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserHomeSearchResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: User = {
    id: data.id,
    avatar: name,
    user_name: data.user_name,
    is_tick: data.is_tick,
    name: data.name,
    is_following: await userAuth.isFollowing(data),
  };

  if (dataTransform.is_following === FollowStatus.FOLLOW) {
    dataTransform['followed_by'] = []
  } else {
    dataTransform['followed_by'] = await data.getFollowedBy(userAuth)
  }

  return dataTransform;
};
