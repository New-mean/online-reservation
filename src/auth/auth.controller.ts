import { UserInfo } from 'src/utils/userInfo.decorator';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/siginUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return await this.authService.signup(
      signUpDto.email,
      signUpDto.password,
      signUpDto.nickName,
      signUpDto.name,
      signUpDto.phoneNumber,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
}
