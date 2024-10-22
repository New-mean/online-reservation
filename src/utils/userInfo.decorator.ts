import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// UserInfo 커스텀 데코레이터 생성
export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // ExecutionContext를 통해 현재 실행 컨텍스트를 가져옴
    const request = ctx.switchToHttp().getRequest();

    // 만약 request에 user 정보가 있다면 반환하고, 그렇지 않으면 null 반환
    return request.user ? request.user : null;
  },
);
