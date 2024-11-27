import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from 'src/users/decorators/role-protected.decorator';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('use role guard')

    const roles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    if(!roles) return true
    if (roles.length === 0) return true

    const user: User = context.switchToHttp().getRequest().user

    if(!user)
      throw new BadRequestException()

    for (const role of user.roles){
      console.log(roles.includes(role))
      if(roles.includes(role))
        return true
    }

    return false

    }
}
