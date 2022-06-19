import { Comment } from 'src/entities/comment.entity';
import { UserLoginResource } from '../user/user-login.resource';
import { UserResource } from '../user/user.resource';

export const CommentResource = async (data: Comment): Promise<Comment> => {
  const dataTransform: Comment = {
    ...data,
    created_by: await UserLoginResource(data.user),
    post: data.post
  };
  delete dataTransform['user'];
  delete dataTransform['post_id'];
  return dataTransform;
};
