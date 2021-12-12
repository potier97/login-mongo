import { Injectable, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    try {
      const newContext = context;
      const response = newContext.switchToHttp().getRequest();
      // console.log(response);
      newContext.switchToHttp().getRequest().body = {
        jwtData: response.jwtData.split(' ')[1],
      };

      return super.canActivate(newContext);
    } catch {
      throw new RpcException('Invalid credentials.');
    }
  }
}
