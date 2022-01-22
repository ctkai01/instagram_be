import { MediaResource } from './media.resource';
import { Media } from '../../post/media.entity';

export const MediaCollection = (datas: Media[]): Media[] => {
  const mediaCollection = datas.map((media: Media): Media => {
    return MediaResource(media);
  });

  return mediaCollection;
};
