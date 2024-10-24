import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateShowDto } from 'src/show/dto/create-show.dto';

export class CreateShowScheduleDto {
  @IsNumber()
  @Type(() => CreateShowDto)
  showId: number;

  @IsDate()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: Date;
  // TODO: showschduledto 작성 , 공연 스케줄 API 작성
}
