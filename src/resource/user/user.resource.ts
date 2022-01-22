import { User } from 'src/auth/auth.entity';

export const UserResource = (data: User): User => {
  const dataTransform: User = {
    ...data,
  };

  return dataTransform;
};
