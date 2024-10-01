import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('Inside LocalGuard');
    return super.canActivate(context);
  }
}
