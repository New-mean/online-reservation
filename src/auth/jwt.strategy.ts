import { ExtractJwt, Strategy } from 'passport-jwt';

// NestJS에서 제공하는 Injectable 데코레이터를 가져옵니다.
import { Injectable } from '@nestjs/common';

// NestJS의 환경 설정(Config)을 다루는 ConfigService를 가져옵니다.
import { ConfigService } from '@nestjs/config';

// NestJS에서 제공하는 PassportStrategy를 가져옵니다.
import { PassportStrategy } from '@nestjs/passport';

// Injectable 데코레이터를 사용하여 클래스를 NestJS에서 관리 가능한 Injectable로 만듭니다.
@Injectable()
// JwtStrategy 클래스를 정의하며, PassportStrategy를 상속하고 있습니다.
export class JwtStrategy extends PassportStrategy(Strategy) {
  // JwtStrategy 클래스의 생성자를 정의하고, ConfigService를 주입받고 있습니다.
  constructor(private readonly configService: ConfigService) {
    // 부모 클래스인 PassportStrategy(Strategy)의 생성자를 호출하면서 JWT 전략에 필요한 옵션들을 전달합니다.
    super({
      // Bearer 토큰에서 JWT를 추출하는 방법을 지정합니다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료 기간을 무시할지 여부를 나타냅니다.
      ignoreExpiration: false,
      // JWT를 검증할 때 사용할 비밀 키를 ConfigService를 통해 가져옵니다.
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  // validate 메서드는 전략이 성공적으로 수행된 후 호출되며, 여기서는 주어진 JWT의 payload를 받아 실제 유저 정보를 조회하는 로직이 구현되어야 합니다.
  async validate(payload: any) {
    // TODO. payload로 전달된 데이터를 통해 실제 유저 정보를 조회해야 합니다!
  }
}
