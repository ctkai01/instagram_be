import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPhoneOrEmail(
  //   property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPhoneOrEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regexEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          const regexPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g;

          return regexEmail.test(value) || regexPhone.test(value); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
