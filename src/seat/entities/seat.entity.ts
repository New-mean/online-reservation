import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Show } from '../../show/entities/show.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @Column({ type: 'int', nullable: false, name: 'seatNumber' })
  seatNumber: number;

  @Column({ type: 'int', nullable: false, name: 'seatPrice' })
  seatPrice: number;

  @Column({ type: 'varchar', nullable: false, name: 'seatGrade' })
  seatGrade: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @ManyToOne(() => Show, (show) => show.seat)
  show: Show;

  @ManyToOne(() => ShowSchedule, (showSchedule) => showSchedule.seat)
  showSchedule: ShowSchedule;

  @OneToMany(() => Reservation, (reservation) => reservation.seat)
  reservation: Reservation;
}
