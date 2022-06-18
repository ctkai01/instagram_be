import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';

export const PostReactResource = async (
  data: Post,
  userAuth: User,
): Promise<Post> => {
  const dataTransform: Post = {
    id: data.id,
    location: data.location,
    caption: data.caption,
    is_off_comment: data.is_off_comment,
    is_hide_like_view: data.is_hide_like_view,
    like_count: await data.getCountLike(),
    is_like: await data.isLike(userAuth),
  };
  delete dataTransform['user'];
  return dataTransform;
};
