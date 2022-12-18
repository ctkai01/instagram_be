import { User } from 'src/entities/auth.entity';

export const UserAdminResource = async (
  data: User,
): Promise<User> => {
  let name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
  name = name.replace('/public', '');

  const dataTransform: User = {
    ...data,
    avatar: name,
  };

  delete dataTransform['refresh_token'];
  delete dataTransform['password'];

  return dataTransform;
};
