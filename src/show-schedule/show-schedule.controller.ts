import { Controller } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';

@Controller('show-schedule')
export class ShowScheduleController {
  constructor(private readonly showScheduleService: ShowScheduleService) {}
}
