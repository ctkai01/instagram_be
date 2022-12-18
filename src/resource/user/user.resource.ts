import { ActiveStatus, Status } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { PostCollection } from '../post/post.collection';

export const UserResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');
  const active_posts = data.posts.filter(post => {
    return post.status === ActiveStatus.ACTIVE
  })
  const dataTransform: User = {
    ...data,
    posts: await PostCollection(active_posts, userAuth),
    avatar: name,
    is_following: await userAuth.isFollowing(data),
    count_follower: await data.countFollowerUser(),  
    count_following: await data.countFollowingUser(),
    followed_by: await data.getFollowedBy(userAuth),
    view_all_story: await data.getViewAll(userAuth)

  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
