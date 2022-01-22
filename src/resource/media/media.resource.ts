import { Media } from './../../post/media.entity';

export const MediaResource = (data: Media): Media => {
  let name = 'http://localhost:5000/' + data.name.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: Media = {
    name,
    type: data.type,
  };
  return dataTransform;
};
