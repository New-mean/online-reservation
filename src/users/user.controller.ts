import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './types/userRole.type';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.User)
  @Get('info')
  async info(@UserInfo() user: User) {
    return await this.userService.findOneById(user);
  }

  @Roles(Role.User)
  @Get(':userId')
  async getPoint(@Param('userId') userId: number) {
    return await this.userService.getPoint(userId);
  }
}
