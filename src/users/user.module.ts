import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Point } from 'src/point/entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Point])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
