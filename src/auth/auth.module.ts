import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Jwt 전략을 담당하는 JwtStrategy를 불러옵니다.
import { JwtStrategy } from './jwt.strategy';

// AuthModule을 정의합니다.
@Module({
  // AuthModule이 사용할 다른 모듈들을 imports 배열에 포함합니다.
  imports: [
    // Passport 모듈을 등록합니다.
    // 여기서는 JWT 전략을 기본 전략으로 사용하며, 세션은 사용하지 않도록 설정합니다.
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    // JwtModule을 비동기적으로 등록합니다.
    JwtModule.registerAsync({
      // useFactory 함수를 통해 JwtModule 설정을 동적으로 생성합니다.
      useFactory: (config: ConfigService) => ({
        // JWT 비밀 키를 ConfigService를 통해 가져와 설정합니다.
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      // useFactory 함수에 주입할 의존성을 명시합니다.
      inject: [ConfigService],
    }),
  ],
  // AuthModule이 사용할 프로바이더(서비스, 전략 등)를 providers 배열에 포함합니다.
  providers: [JwtStrategy],
})
export class AuthModule {} // AuthModule 클래스를 외부에 공개합니다.
