import { Post } from 'src/post/post.entity';
import { MediaCollection } from '../media/media.collection';

export const PostResource = (data: Post): Post => {
  const dataTransform: Post = {
    ...data,
    created_by: data.user,
    media: MediaCollection(data.media),
  };
  delete dataTransform['user'];
  return dataTransform;
};
