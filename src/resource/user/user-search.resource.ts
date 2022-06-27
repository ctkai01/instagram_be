import { User } from 'src/entities/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserSearchResource = async (
  data: User,
  userAuth: User
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: User = {
    id: data.id,
    avatar: name,
    user_name: data.user_name,
    is_tick: data.is_tick,
    name: data.name,
    view_all_story: await data.getViewAll(userAuth)

  };

  return dataTransform;
};
