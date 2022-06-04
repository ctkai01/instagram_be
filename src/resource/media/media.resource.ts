import { Media } from 'src/entities/media.entity';

export const MediaResource = (data: Media): Media => {
  let name = 'http://localhost:5000/' + data.name.split('\\').join('/');
  name = name.replace('/public', '');
  let nameCover = null
  if (data.cover_name) {
    nameCover =  'http://localhost:5000/' + data.cover_name.split('\\').join('/');
    nameCover = nameCover.replace('/public', '');
  }
 
  const dataTransform: Media = {
    name,
    type: data.type,
    is_mute: data.is_mute,
    cover_name: nameCover,
    tags_user: data.tags_user
  };
  return dataTransform;
};
