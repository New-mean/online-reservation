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

@Index('email', ['email'], { unique: true })
@Entity({ name: 'shows' })
export class User {
  @PrimaryGeneratedColumn()
  showId: number;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'showTitle' })
  showTitle: string;

  @Column({ type: 'varchar', nullable: false, name: 'showExplain' })
  showExplain: string;

  @Column({ type: 'varchar', nullable: false, name: 'showCast' })
  showCast: string;

  @Column({ type: 'varchar', nullable: false, name: 'showPrice' })
  showPrice: string;

  @Column({ type: 'varchar', nullable: false, name: 'showImage' })
  showImage: string;

  @Column({ type: 'varchar', nullable: false, name: 'showRuntime' })
  showRuntime: string;

  @Column({ type: 'varchar', nullable: false, name: 'showCategory' })
  showCategory: string;

  @Column({ type: 'boolean', nullable: false, name: 'showRuntime' })
  is_Bookable: boolean;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', comment: '수정일시' })
  updateAt: Date;
}
