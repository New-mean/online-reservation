import { Module } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';
import { ShowScheduleController } from './show-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/show/entities/show.entity';
import { ShowSchedule } from './entities/showSchedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSchedule, Seat])],
  controllers: [ShowScheduleController],
  providers: [ShowScheduleService],
})
export class ShowScheduleModule {}
