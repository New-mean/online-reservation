import { Module } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';
import { ShowScheduleController } from './show-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/show/entities/show.entity';
import { ShowSchedule } from './entities/showSchedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSchedule])],
  controllers: [ShowScheduleController],
  providers: [ShowScheduleService],
})
export class ShowScheduleModule {}
