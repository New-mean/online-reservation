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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    nickName: string,
    name: string,
    phoneNumber: string,
  ) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        throw new BadRequestException('이메일 입력이 필요합니다.');
      }

      if (!emailRegex.test(email)) {
        throw new BadRequestException('올바르지 않은 이메일 형식입니다.');
      }

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('이미 등록된 이메일입니다.');
      }

      if (!password) {
        throw new BadRequestException('비밀번호 입력이 필요합니다.');
      }

      if (password.length < 6) {
        throw new BadRequestException('비밀번호는 최소 6자 이상이어야 합니다.');
      }

      if (!name) {
        throw new BadRequestException('이름을 입력해주세요.');
      }

      if (!nickName) {
        throw new BadRequestException('이름을 입력해주세요.');
      }

      if (!phoneNumber) {
        throw new BadRequestException('전화번호를 입력해주세요.');
      }

      const hashedPassword = await hash(password, 10);
      const users = await this.userRepository.save({
        email,
        password: hashedPassword,
        name,
        nickName,
        phoneNumber,
      });
      return await this.userRepository.findOne({
        where: { userid: users.userid },
        select: {
          email: true,
          password: true,
          nickName: true,
          name: true,
          phoneNumber: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('에러가 발생했습니다.');
    }
  }

  async login(email: string, password: string) {
    try {
      if (!email) {
        throw new BadRequestException('이메일 입력이 필요합니다.');
      }

      const user = await this.userRepository.findOne({
        select: ['userid', 'email', 'password'],
        where: { email },
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

      const payload = { email, sub: user.userid };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException('에러가 발생했습니다.');
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
