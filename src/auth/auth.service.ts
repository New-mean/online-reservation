import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Point } from 'src/point/entities/point.entity';
import { Role } from 'src/users/types/userRole.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    nickName: string,
    name: string,
    phone: string,
    role: Role,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const existingNickName = await this.findByNickName(nickName);
    if (existingNickName) {
      throw new ConflictException('이미 등록된 닉네임 입니다.');
    }

    const existingPhone = await this.findByPhone(phone);
    if (existingPhone) {
      throw new ConflictException('이미 등록된 전화번호입니다.');
    }

    const hashedPassword = await hash(password, 10);
    const users = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      nickName,
      phone,
      role,
    });

    await this.pointRepository.save({
      user: users,
      reason: '신규 가입 고객 포인트 증정',
    });

    return await this.userRepository.findOne({
      where: { userId: users.userId },
      select: ['email', 'nickName', 'name', 'phone', 'role'],
    });
  }

  async login(email: string, password: string) {
    if (!email) {
      throw new BadRequestException('이메일 입력이 필요합니다.');
    }

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['userId', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하는 인증 정보가 없습니다.',
      );
    }

    if (!password) {
      throw new BadRequestException('비밀번호 입력이 필요합니다.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하는 정보가 없습니다.',
      );
    }

    const payload = { email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByNickName(nickName: string) {
    return await this.userRepository.findOneBy({ nickName });
  }

  async findByPhone(phone: string) {
    return await this.userRepository.findOneBy({ phone });
  }
}
