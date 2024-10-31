import { Seat } from 'src/seat/entities/seat.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservationId: number;

  // @Column({ type: 'varchar', nullable: false })
  // grade: string;

  // @Column({ type: 'int', nullable: false })
  // totalSeat: number;

  @Column({ type: 'boolean', nullable: false })
  cancle: boolean;

  @Column({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_Reserved: boolean;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => Seat, (seat) => seat.reservation)
  seat: Seat;

  @ManyToOne(() => Show, (show) => show.reservation)
  show: Show;

  @ManyToOne(() => ShowSchedule, (showSchedule) => showSchedule.reservation)
  showSchedule: ShowSchedule;
}
