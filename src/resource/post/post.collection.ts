import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { PostResource } from './post.resource';

export const PostCollection = async (
  datas: Post[],
  userAuth: User,
): Promise<Post[]> => {
  const postCollection = await Promise.all(
    datas.map(async (post: Post): Promise<Post> => {
      return await PostResource(post, userAuth);
    }),
  );
  return postCollection;
};
