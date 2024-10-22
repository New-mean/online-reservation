import { number } from 'joi';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

@Entity({ name: 'users' })
export class Point {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  pointid: number;

  @Column({ type: 'number', default: 1000000, name: 'point' })
  point: number;

  @CreateDateColumn({ name: 'createAt', comment: '생성일시' })
  createdAt: Date;
  user: any;

  @ManyToOne((type) => User, (user) => user.point, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  users: Relation<User>;
}
