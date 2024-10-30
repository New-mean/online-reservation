import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Seat, (seat) => seat.showSchedule)
  seat: Seat;

  @ManyToOne(() => Show, (show) => show.showschdule)
  show: Show;

  @ManyToOne(() => Reservation, (reservation) => reservation.showSchedule)
  reservation: Reservation;
}
