import { Message } from 'src/entities/message.entity';
import { UserConversationResource } from '../user/user-conversation.resource';

export const MessageResource = (data: Message): Message => {
  const dataTransform: Message = {
    id: data.id,
    user: UserConversationResource(data.user),
    message: data.message
  };
  return dataTransform
};
