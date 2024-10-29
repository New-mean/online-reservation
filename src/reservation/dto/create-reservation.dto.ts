import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: '좌석 등급을 입력해주세요.' })
  grade: string;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 수를 입력해주세요' })
  totalSeat: number;
}
