import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email을 입력해주세요' })
  email: string;

  @IsString()
  @MinLength(6, { message: '6글자 이상 작성해주세요.' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  nickName: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요' })
  phone: string;

  @IsBoolean()
  @IsNotEmpty({ message: '관리자 인지 손님인지 구분해 주세요.' })
  is_Admin: boolean;
}
