import { User } from 'src/entities/auth.entity';
import { Post } from 'src/entities/post.entity';
import { PostHomeResource } from './post-home.resource';

export const PostHomeCollection = (
  datas: Post[],
  userAuth: User,
): Promise<Post[]> => {
  const postCollection = Promise.all(
    datas.map(async (post: Post): Promise<Post> => {
      return await PostHomeResource(post, userAuth);
    }),
  );

  return postCollection;
};
