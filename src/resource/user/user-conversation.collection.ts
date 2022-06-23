import { User } from 'src/entities/auth.entity';
import { UserConversationResource } from './user-conversation.resource';
import { UserResource } from './user.resource';

export const UserConversationCollection = (
  datas: User[],
): User[] => {
  const userCollection = 
    datas.map((user: User) => {
      const userResource =  UserConversationResource(user);
      return userResource;
    })

  return userCollection;
};
