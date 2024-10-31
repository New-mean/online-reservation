import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Role } from '../types/categoryRole.type';
import { Type } from 'class-transformer';
import { SeatInfoDto } from 'src/seat/dto/create-seat.dto';

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

  @IsString()
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요' })
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  showImage: string;

  @IsString()
  @IsNotEmpty({ message: '공연 진행 시간을 입력해주세요.' })
  showRunTime: string;

  @IsEnum(Role, { message: 'Musical,Opera,Concert 중 하나만 입력해주세요.' })
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  showCategory: Role;

  @IsString()
  @IsNotEmpty({ message: '장소를 입력해주세요.' })
  showLocation: string;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => SeatInfoDto)
  // seatInfo: SeatInfoDto[];
}
