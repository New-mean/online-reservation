import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowDto {
  @IsString()
  @IsNotEmpty({ message: 'title를 입력해주세요.' })
  showTitle: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  showExplain: string;

  @IsString()
  @IsString({ message: '출연 배우들을 입력해주세요.' })
  showCast: string;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  showPrice: number;
}
