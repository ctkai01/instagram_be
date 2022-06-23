import { Conversation } from 'src/entities/conversation.entity';
import { ConversationResource } from './conversation.resource';

export const ConversationCollection = (
  datas: Conversation[],
  idUserAuth: number
): Conversation[] => {
  const converSationCollection = 
    datas.map((conversation: Conversation) => {
      const conversationResource =  ConversationResource(conversation, idUserAuth);
      return conversationResource;
    })

  return converSationCollection;
};
