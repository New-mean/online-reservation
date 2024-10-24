import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../types/categoryRole.type';

@Entity({ name: 'shows' })
export class Show {
  @PrimaryGeneratedColumn()
  showId: number;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'showTitle' })
  showTitle: string;

  @Column({ type: 'varchar', nullable: false, name: 'showExplain' })
  showExplain: string;

  @Column({ type: 'varchar', nullable: false, name: 'showCast' })
  showCast: string;

  @Column({ type: 'int', nullable: false, name: 'showPrice' })
  showPrice: number;

  @Column({ type: 'varchar', nullable: false, name: 'showImage' })
  showImage: string;

  @Column({ type: 'varchar', nullable: false, name: 'showRunTime' })
  showRunTime: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Musical,
    name: 'showCategory',
  })
  showCategory: Role;

  @Column({ type: 'varchar', nullable: false, name: 'showLocation' })
  showLocation: string;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', comment: '수정일시' })
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.shows)
  user: User;
}
