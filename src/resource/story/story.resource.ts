import { Story } from 'src/story/story.entity';

export const StoryResource = (data: Story): Story => {
  let name = 'http://localhost:5000/' + data.media.split('\\').join('/');
  name = name.replace('/public', '');
  const dataTransform: Story = {
    ...data,
    created_by: data.user,
    media: name,
  };
  delete dataTransform['user'];
  return dataTransform;
};
