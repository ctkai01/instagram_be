import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { MediaCollection } from '../media/media.collection';
import { UserHomeResource } from '../user/user-home.resource';
import { UserReviewResource } from '../user/user-review.resource';

export const PostReviewResource = async (
  data: Post,
): Promise<Post> => {
  const dataTransform: Post = {
    ...data,
    created_by: await UserReviewResource(data.user),
    media: MediaCollection(data.media),
    like_count: await data.getCountLike(),
    comment_count: await data.getCountComment(),
  };
  delete dataTransform['user'];
  return dataTransform;
};
