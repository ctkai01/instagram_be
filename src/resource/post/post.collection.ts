import { Post } from 'src/post/post.entity';
import { PostResource } from './post.resource';

export const PostCollection = (datas: Post[]): Post[] => {
  const postCollection = datas.map((post: Post): Post => {
    return PostResource(post);
  });

  return postCollection;
};
