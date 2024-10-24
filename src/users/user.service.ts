import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'lodash';
import { User } from './entities/user.entity';
import { Point } from 'src/point/entities/point.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(user: User) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.points', 'points')
      .select(['user.nickName', 'points.pointid', 'points.point'])
      .where('user.userId = :userid', { userid: user.userId })
      .getOne();

    if (!users) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return users;
  }
}
