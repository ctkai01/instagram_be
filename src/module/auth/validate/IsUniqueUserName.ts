import { UserRepository } from '../auth.repository';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { getCustomRepository } from 'typeorm';

export function IsUniqueUserName(
  // property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueUserName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any): Promise<any> {
          const user = getCustomRepository(UserRepository);
          const checkUniqueUsername = await user.findOne({
            user_name: value,
          });

          return !checkUniqueUsername;
        },
      },
    });
  };
}
