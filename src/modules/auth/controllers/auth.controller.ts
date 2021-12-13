import { Controller, Logger, UseGuards, Post } from '@nestjs/common';
import { CustomAuthGuard } from '../guards/custom-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

//Importados
import { AuthService } from '../services/auth.service';
import { loginUserTp } from '@configdata/path';
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
  @Post()
  async validateTokeb(): Promise<boolean> {
    try {
      // console.log(jwt);
      return true;
    } catch {
      return false;
    }
  }
}
