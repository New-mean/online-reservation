import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty({ message: 'showScheduleId를 입력해주세요.' })
  showScheduleId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'seatId를 입력해주세요.' })
  seatId: number;
}
