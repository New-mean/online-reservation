import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Point } from 'src/point/entities/point.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  userid: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickName: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Role, default: Role.User, name: 'Role' })
  role: Role;

  @CreateDateColumn({ name: 'createAt', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updateAt', comment: '수정일시' })
  updatedAt: Date;

  @OneToMany(() => Point, (point) => point.user)
  @JoinColumn()
  point: Point[];
}
