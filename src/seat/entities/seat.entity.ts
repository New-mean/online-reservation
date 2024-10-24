import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Show } from '../../show/entities/show.entity';

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
}
