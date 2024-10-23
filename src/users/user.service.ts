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
      .leftJoinAndSelect('user.points', 'points') // User와 Point 관계를 left join으로 가져옴
      .select(['user.nickName', 'points.pointid', 'points.point']) // 필요한 필드만 선택
      .where('user.userid = :userid', { userid: user.userid })
      .getOne();

    if (!users) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return users;
  }
}
