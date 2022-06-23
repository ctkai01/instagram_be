import { Message } from 'src/entities/message.entity';
import { MessageResource } from './message.resource';

export const MessageCollection = (
  datas: Message[],
): Message[] => {
  const messageCollection = 
    datas.map((message: Message) => {
      const messageResource =  MessageResource(message);
      return messageResource;
    })

  return messageCollection;
};
