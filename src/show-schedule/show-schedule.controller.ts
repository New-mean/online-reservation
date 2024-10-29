import { Body, Controller, Param, Post } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';
import { CreateShowScheduleDto } from './dto/create-showSchedule.dto';
import { Role } from 'src/users/types/userRole.type';
import { Roles } from 'src/auth/roles.decorator';

@Controller('showSchedule')
export class ShowScheduleController {
  constructor(private readonly showScheduleService: ShowScheduleService) {}

  @Roles(Role.Admin)
  @Post(':showId')
  async create(
    @Param('showId') showId: number,
    @Body() createShowScheduleDto: CreateShowScheduleDto,
  ) {
    return await this.showScheduleService.createSchedule(
      showId,
      createShowScheduleDto.showDate,
      createShowScheduleDto.showTime,
    );
  }
}
