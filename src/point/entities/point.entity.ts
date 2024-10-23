import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'points' })
export class Point {
  @PrimaryGeneratedColumn()
  pointid: number;

  @Column({ type: 'int', default: 1000000, name: 'point' })
  point: number;

  @Column({ type: 'varchar', name: 'reason' })
  reason: string;

  @Column({ type: 'int', default: 0, name: 'point_receipt' })
  point_receipt: number;

  @CreateDateColumn({ name: 'createAt', comment: '생성일시' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.points, {
    onDelete: 'CASCADE',
  })
  user: User;
}
