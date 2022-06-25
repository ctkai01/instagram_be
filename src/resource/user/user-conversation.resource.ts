import { User } from 'src/entities/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserConversationResource = (
  data: User,
): User => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');

  const dataTransform: User = {
    id: data.id,
    user_name: data.user_name,
    name: data.name,
    avatar: name,
    is_tick: data.is_tick,
  };

  return dataTransform;
};
