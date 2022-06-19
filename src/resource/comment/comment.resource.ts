import { User } from 'src/entities/auth.entity';
import { Comment } from 'src/entities/comment.entity';
import { UserFollowResource } from '../user/user-follow.resource';
import { CommentCollection } from './comment.collection';

export const CommentResource = async (data: Comment, userAuth: User): Promise<Comment> => {
  const dataTransform: Comment = {
    ...data,
    created_by: await UserFollowResource(data.user, userAuth, true),
    post: data.post,
    like_count: await data.getCountLike(),
    is_like: await data.isLike(userAuth),
  };

  if (data.childComments) {
    dataTransform['childComments'] = await CommentCollection(data.childComments, userAuth)
  }
  delete dataTransform['user'];
  delete dataTransform['post_id'];
  return dataTransform;
};  
