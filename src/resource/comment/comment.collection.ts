import { User } from 'src/entities/auth.entity';
import { Comment } from 'src/entities/comment.entity';
import { CommentResource } from './comment.resource';

export const CommentCollection = async (datas: Comment[], userAuth: User): Promise<Comment[]> => {
  const commentCollection =  await Promise.all( datas.map(async (comment: Comment): Promise<Comment> => {
    const userResource = await CommentResource(comment, userAuth);
    return userResource;
  }))

  return commentCollection;
};
