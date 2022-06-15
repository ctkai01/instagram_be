import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { PostFollowResource } from './post-follow.resource';

export const PostFollowCollection = async (
  datas: Post[],
  userAuth: User,
): Promise<Post[]> => {
  const postCollection = await Promise.all(
    datas.map(async (post: Post): Promise<Post> => {
      return await PostFollowResource(post, userAuth);
    }),
  );
  return postCollection;
};
