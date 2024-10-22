import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 로그인 요청에 사용되는 DTO 클래스 정의
export class LoginDto {
  // IsEmail 데코레이터를 사용하여 email이 이메일 형식인지 검사
  // IsNotEmpty 데코레이터를 사용하여 email이 비어있지 않은지 검사하고, 비어 있을 경우 지정된 에러 메시지를 반환
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  // IsString 데코레이터를 사용하여 password가 문자열인지 검사
  // IsNotEmpty 데코레이터를 사용하여 password가 비어있지 않은지 검사하고, 비어 있을 경우 지정된 에러 메시지를 반환
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
