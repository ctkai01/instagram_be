import { Conversation } from 'src/entities/conversation.entity';
import { MessageCollection } from '../message/message.collection';
import { UserConversationCollection } from '../user/user-conversation.collection';

export const ConversationResource = (data: Conversation, idUserAuth): Conversation => {
  const dataTransform: Conversation = {
    id: data.id,
    users: UserConversationCollection(data.users.filter(user => user.id !== idUserAuth)),
    messages: MessageCollection(data.messages)
  };
  return dataTransform
};
