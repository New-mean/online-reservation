import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CreateShowDto } from 'src/show/dto/create-show.dto';
import { Timestamp } from 'typeorm';

export class CreateShowScheduleDto {
  @IsDateString()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: string;

  @IsString()
  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  showTime: string;
}
