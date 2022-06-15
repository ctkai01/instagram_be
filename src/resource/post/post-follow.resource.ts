import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { MediaCollection } from '../media/media.collection';

export const PostFollowResource = async (
  data: Post,
  userAuth: User,
): Promise<Post> => {
  const dataTransform: Post = {
    id: data.id,
    caption: data.caption,
    location: data.location,
    is_off_comment: data.is_off_comment,
    is_hide_like_view: data.is_hide_like_view,
    media: MediaCollection(data.media),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
  delete dataTransform['user'];
  return dataTransform;
};
