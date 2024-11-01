import { Module, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/users/entities/user.entity';
import { Show } from 'src/show/entities/show.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
import { Point } from 'src/point/entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Seat, User, Show, ShowSchedule, Point])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
