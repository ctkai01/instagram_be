import { Post } from 'src/post/post.entity';
import { MediaCollection } from '../media/media.collection';
import { UserLoginResource } from '../user/user-login.resource';

export const PostResource = (data: Post): Post => {
  const dataTransform: Post = {
    ...data,
    created_by: UserLoginResource(data.user),
    media: MediaCollection(data.media),
  };
  delete dataTransform['user'];
  return dataTransform;
};
