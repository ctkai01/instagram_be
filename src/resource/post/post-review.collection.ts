import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { PostHomeResource } from './post-home.resource';
import { PostReviewResource } from './post-review.resource';

export const PostReviewCollection = (
  datas: Post[],
): Promise<Post[]> => {
  const postCollection = Promise.all(
    datas.map(async (post: Post): Promise<Post> => {
      return await PostReviewResource(post);
    }),
  );

  return postCollection;
};
