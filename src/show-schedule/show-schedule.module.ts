import { Module } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';
import { ShowScheduleController } from './show-schedule.controller';

@Module({
  controllers: [ShowScheduleController],
  providers: [ShowScheduleService],
})
export class ShowScheduleModule {}
