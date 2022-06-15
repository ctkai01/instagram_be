import { User } from 'src/entities/auth.entity';
import { PostFollowCollection } from '../post/post-follow.collection';
import { PostCollection } from '../post/post.collection';

export const UserFollowResource = async (
  data: User,
  userAuth: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');

  const postTransform = data.posts.slice(0,3)
  const dataTransform: User = {
    ...data,
    posts: await PostFollowCollection(postTransform, userAuth),
    avatar: name,
    is_following: await userAuth.isFollowing(data),
    count_follower: await data.countFollowerUser(),  
    count_following: await data.countFollowingUser(),
    followed_by: await data.getFollowedBy(userAuth)
  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
