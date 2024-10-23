import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Point } from 'src/point/entities/point.entity';
// import { Reservation } from './Reservation.entity';

@Index('email', ['email'], { unique: true })
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

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

  @Column({ type: 'enum', enum: Role, default: Role.User, name: 'Role' })
  role: Role;

  @Column({ type: 'boolean', unique: true, nullable: false, name: 'is_Admin' })
  is_Admin: boolean;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', comment: '수정일시' })
  updateAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', comment: '삭제일시' })
  deletedAt?: Date | null;

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];
}
