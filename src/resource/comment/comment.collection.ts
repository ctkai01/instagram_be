import { Comment } from 'src/entities/comment.entity';
import { CommentResource } from './comment.resource';

export const CommentCollection = async (datas: Comment[]): Promise<Comment[]> => {
  const commentCollection =  await Promise.all( datas.map(async (comment: Comment): Promise<Comment> => {
    const userResource = await CommentResource(comment);
    return userResource;
  }))

  return commentCollection;
};
