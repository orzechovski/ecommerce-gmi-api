import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/regitser-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }
}
