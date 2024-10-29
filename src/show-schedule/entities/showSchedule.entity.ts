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

  @Column({ type: 'varchar', nullable: false })
  showDate: string;

  @Column({ type: 'varchar', nullable: false })
  showTime: string;

  @ManyToOne(() => Show, (show) => show.showschdule)
  show: Show;
}
