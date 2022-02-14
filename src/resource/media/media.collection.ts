import { Media } from 'src/entities/media.entity';
import { MediaResource } from './media.resource';

export const MediaCollection = (datas: Media[]): Media[] => {
  const mediaCollection = datas.map((media: Media): Media => {
    return MediaResource(media);
  });

  return mediaCollection;
};
