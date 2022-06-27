import { Story } from 'src/entities/story.entity';
import { StoryResource } from './story.resource';

export const StoryCollection = async (
  datas: Story[],
  idUserAuth: number,
): Promise<Story[]> => {
  const storyCollection = await Promise.all(
    datas.map(async (story: Story): Promise<Story> => {
      return await StoryResource(story, idUserAuth);
    }),
  );

  return storyCollection;
};
