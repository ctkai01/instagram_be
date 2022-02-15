import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { MediaCollection } from '../media/media.collection';
import { UserLoginResource } from '../user/user-login.resource';

export const PostResource = async (
  data: Post,
  userAuth: User,
): Promise<Post> => {
  const dataTransform: Post = {
    id: data.id,
    caption: data.caption,
    location: data.location,
    created_by: UserLoginResource(data.user),
    is_off_comment: data.is_off_comment,
    like_count: await data.getCountLike(),
    is_like: await data.isLike(userAuth),
    media: MediaCollection(data.media),
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.user,
  };
  delete dataTransform['user'];
  return dataTransform;
};
