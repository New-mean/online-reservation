import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'showSchedules' })
export class ShowSchedule {
  @PrimaryGeneratedColumn()
  showScheduleId: number;

  @Column({ type: 'timestamp', nullable: false })
  showDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  showTime: Date;

  @ManyToOne(() => Show, (show) => show.showschdule)
  show: Show;

  @ManyToOne(() => Reservation, (reservation) => reservation.showSchedule)
  reservation: Reservation;
}
