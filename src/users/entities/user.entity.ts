import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Point } from 'src/point/entities/point.entity';
import { Show } from '../../show/entities/show.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Index('email', ['email'], { unique: true })
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false, name: 'password' })
  password: string;

  @Column({ type: 'varchar', nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'nickName' })
  nickName: string;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'phone' })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', comment: '수정일시' })
  updateAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', comment: '삭제일시' })
  deletedAt?: Date | null;

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];

  @OneToMany(() => Show, (show) => show.user)
  shows: Show[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];
}
