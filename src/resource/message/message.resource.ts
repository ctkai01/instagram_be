import { Message } from 'src/entities/message.entity';
import { UserConversationResource } from '../user/user-conversation.resource';

export const MessageResource = (data: Message): Message => {
    let nameImage = ''
    if (data.image) {
      nameImage = 'http://localhost:5000/' + data.image.split('\\').join('/');
      nameImage = nameImage.replace('/public', '');
    }

  const dataTransform: Message = {
    id: data.id,
    user: UserConversationResource(data.user),
    message: data.message,
    image: nameImage,
    conversation: data.conversation
  };
  return dataTransform
};
