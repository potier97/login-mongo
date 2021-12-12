import { Controller, Logger, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from '../guards/custom-auth.guard';
import {
  EventPattern,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';

//Importados
import { AuthService } from '../services/auth.service';
import { loginUserTp, validateJWTTp } from '@configdata/path';
import { AuthDto } from '../dto/auth.dto';
import { UsersService } from '@modules/users/services/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // logind(@Req() req: Request) {
  //   const user = req.user as User;
  //   return this.authService.generateJWT(user);
  // }

  @UseGuards(CustomAuthGuard)
  @MessagePattern(loginUserTp)
  async login(req: AuthDto) {
    try {
      const payload = req as AuthDto;
      const user = await this.usersService.getPayloadUserAuth(payload.email);
      // console.log(user);
      return this.authService.generateJWT(user);
    } catch {
      return {
        error: 400,
        message: 'Usuario No encontrado',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('onValidateJWTTp')
  validateTokeb(): boolean {
    try {
      // console.log(jwt);
      // console.log('este es otro')
      return true;
    } catch {
      throw new RpcException('Invalid credentials.');
    }
  }
}
