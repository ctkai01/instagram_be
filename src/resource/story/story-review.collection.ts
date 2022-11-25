import { Story } from 'src/entities/story.entity';
import { StoryReviewResource } from './story-review.resource';

export const StoryReviewCollection = async (
  datas: Story[],
): Promise<Story[]> => {
  const storyCollection = await Promise.all(
    datas.map(async (story: Story): Promise<Story> => {
      return await StoryReviewResource(story);
    }),
  );

  return storyCollection;
};
