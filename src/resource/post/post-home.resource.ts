import { User } from 'src/auth/auth.entity';
import { Post } from 'src/post/post.entity';
import { MediaCollection } from '../media/media.collection';
import { UserHomeResource } from '../user/user-home.resource';

export const PostHomeResource = async (
  data: Post,
  userAuth: User,
): Promise<Post> => {
  const dataTransform: Post = {
    ...data,
    created_by: await UserHomeResource(data.user, userAuth),
    media: MediaCollection(data.media),
  };
  delete dataTransform['user'];
  return dataTransform;
};
