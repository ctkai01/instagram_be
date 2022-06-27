import { Story } from 'src/entities/story.entity';

export const StoryResource = async (data: Story, idAuth: number): Promise<Story> => {
  let name = ''
  if (data.media) {
    name = 'http://localhost:5000/' + data.media.split('\\').join('/');
    name = name.replace('/public', '');
  }


  const dataTransform: Story = {
    ...data,
    created_by: data.user,
    media: name,
    is_view: await data.getIsView(idAuth)
  };
  delete dataTransform['user'];
  return dataTransform;
};
