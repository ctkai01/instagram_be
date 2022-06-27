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
    created_by: await UserLoginResource(data.user, userAuth),
    is_off_comment: data.is_off_comment,
    is_hide_like_view: data.is_hide_like_view,
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
