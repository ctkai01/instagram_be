import { Story } from 'src/entities/story.entity';
import { StoryResource } from './story.resource';

export const StoryCollection = (datas: Story[]): Story[] => {
  const storyCollection = datas.map((story: Story): Story => {
    return StoryResource(story);
  });

  return storyCollection;
};
