import { PartialType } from '@nestjs/swagger';
import { CreateShowScheduleDto } from './create-show-schedule.dto';

export class UpdateShowScheduleDto extends PartialType(CreateShowScheduleDto) {}
