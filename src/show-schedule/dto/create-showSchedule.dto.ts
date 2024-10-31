import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SeatInfoDto } from 'src/seat/dto/create-seat.dto';
import { CreateShowDto } from 'src/show/dto/create-show.dto';
import { Timestamp } from 'typeorm';

export class CreateShowScheduleDto {
  @IsDateString()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: string;

  @IsString()
  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  showTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatInfoDto)
  seatInfo: SeatInfoDto[];
}
