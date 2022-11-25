import { Story } from 'src/entities/story.entity';
import { UserReviewResource } from '../user/user-review.resource';

export const StoryReviewResource = async (data: Story): Promise<Story> => {
  let name = ''
  if (data.media) {
    name = 'http://localhost:5000/' + data.media.split('\\').join('/');
    name = name.replace('/public', '');
  }


  const dataTransform: Story = {
    ...data,
    created_by: await UserReviewResource(data.user),
    media: name,
  };
  delete dataTransform['user'];
  return dataTransform;
};
