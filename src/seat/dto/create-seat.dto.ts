import { IsNotEmpty } from 'class-validator';

export class SeatInfoDto {
  @IsNotEmpty({ message: '좌석 번호를 입력해주세요.' })
  seatNumber: number;

  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  seatPrice: number;

  @IsNotEmpty({ message: '등급을 입력해주세요.' })
  seatGrade: string;
}
