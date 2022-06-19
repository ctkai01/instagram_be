import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
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
    like_count: await data.getCountLike(),
    is_like: await data.isLike(userAuth),
    comment_count: await data.getCountComment(),
  };
  delete dataTransform['user'];
  return dataTransform;
};
