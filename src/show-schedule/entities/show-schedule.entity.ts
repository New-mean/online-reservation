import { Show } from 'src/show/entities/show.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'showSchdules' })
export class ShowSchedule {
  @PrimaryGeneratedColumn()
  showSchduleId: number;

  @Column({ type: 'date', nullable: false })
  showDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  showTime: Date;

  @ManyToOne(() => Show, (show) => show.showschdule, {
    onDelete: 'CASCADE',
  })
  show: Show;
}
