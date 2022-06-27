import { Story } from 'src/entities/story.entity';

export const StoryResource = (data: Story): Story => {
  let name = ''
  if (data.media) {
    name = 'http://localhost:5000/' + data.media.split('\\').join('/');
    name = name.replace('/public', '');
  }


  const dataTransform: Story = {
    ...data,
    created_by: data.user,
    media: name,
  };
  delete dataTransform['user'];
  return dataTransform;
};
