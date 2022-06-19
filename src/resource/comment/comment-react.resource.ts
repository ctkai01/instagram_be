import { User } from 'src/entities/auth.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';

export const CommentReactResource = async (
  data: Comment,
  userAuth: User,
): Promise<Comment> => {
  const dataTransform: Comment = {
    id: data.id,
    content: data.content,
    like_count: await data.getCountLike(),
    is_like: await data.isLike(userAuth),
  };
  return dataTransform;
};
