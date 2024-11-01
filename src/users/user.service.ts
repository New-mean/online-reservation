import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'lodash';
import { User } from './entities/user.entity';
import { Point } from 'src/point/entities/point.entity';
import { Repository } from 'typeorm';

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

  async getPoint(userId: number) {
    const point = await this.pointRepository.find({
      where: { user: { userId } },
      relations: { user: true },
      select: { point_receipt: true, reason: true },
      order: { createdAt: 'DESC' },
    });
    return {
      message: '포인트 내역 입니다.',
      data: point.map((point) => ({
        point_recepit: point.point_receipt,
        reason: point.reason,
        createdAt: point.createdAt,
      })),
    };
  }
}
