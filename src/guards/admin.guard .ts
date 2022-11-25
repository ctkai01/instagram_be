import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard implements CanActivate {


  canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      console.log(request);
      return true;
    // const isPublic = this.reflector.getAllAndOverride('isPublic', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (isPublic) {
    //   return true;
    // }
    // return super.canActivate(context);
  }
}
