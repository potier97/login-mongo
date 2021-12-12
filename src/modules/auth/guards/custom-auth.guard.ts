import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  canActivate(context: ExecutionContext) {
    const newContext = context;
    const response = newContext.switchToHttp().getRequest();
    // console.log(response);
    newContext.switchToHttp().getRequest().body = {
      email: response.email,
      password: response.password,
    };
    // console.log(newContext.switchToHttp().getRequest());
    const existUser = this.validate(response.email, response.password);
    if (existUser) {
      return super.canActivate(newContext);
    }
    return false;
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return false;
    }
    return user;
  }
}
