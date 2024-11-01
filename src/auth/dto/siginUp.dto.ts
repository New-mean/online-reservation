import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { Role } from 'src/users/types/userRole.type';

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
  @IsPhoneNumber('KR', { message: '전화번호를 정확하게 입력해주세요.' })
  @IsNotEmpty({ message: '전화번호를 입력해주세요' })
  phone: string;

  @IsEnum(Role, { message: 'User, Admin중 하나를 선택하세요.' })
  @IsNotEmpty({ message: 'Role을 입력해주세요.' })
  role: Role;
}
