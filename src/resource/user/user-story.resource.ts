import { User } from 'src/entities/auth.entity';
import { PostFollowCollection } from '../post/post-follow.collection';
import { PostCollection } from '../post/post.collection';
import { StoryCollection } from '../story/story.collection';

export const UserStoryResource = async (
  data: User,
  userAuth: User
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  
  const dataTransform: User = {
    id: data.id,
    name: data.name,
    user_name: data.user_name,
    avatar: name,
    stories: await StoryCollection(data.stories, userAuth.id),
    view_all_story: await data.getViewAll(userAuth)
  };


  return dataTransform;
};
