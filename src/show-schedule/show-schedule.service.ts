import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowSchedule } from './entities/showSchedule.entity';
import { DataSource, Repository } from 'typeorm';
import { Show } from 'src/show/entities/show.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Injectable()
export class ShowScheduleService {
  constructor(
    @InjectRepository(ShowSchedule)
    private showScheduleRepository: Repository<ShowSchedule>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    private readonly dataSource: DataSource,
  ) {}

  async createSchedule(showId: number, showDate: string, showTime: string, seatInfo: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const show = await this.showRepository.findOne({
        where: { showId },
      });

      if (!show) {
        throw new BadRequestException('해당 showId가 존재하지 않습니다.');
      }

      const fullDateTime = new Date(`${showDate} ${showTime}`);
      if (isNaN(fullDateTime.getTime())) {
        throw new BadRequestException('유효한 날짜와 시간 형식이 아닙니다.');
      }

      const schedule = this.showScheduleRepository.create({
        show,
        showDate: fullDateTime,
        showTime: fullDateTime,
        gradeS: seatInfo.find((seat) => seat.seatGrade === 'S')?.seatNumber || 0,
        gradeA: seatInfo.find((seat) => seat.seatGrade === 'A')?.seatNumber || 0,
        gradeC: seatInfo.find((seat) => seat.seatGrade === 'C')?.seatNumber || 0,
      });
      console.log(show);

      await queryRunner.manager.save(ShowSchedule, schedule);

      for (const seat of seatInfo) {
        const { seatGrade, seatPrice, seatNumber } = seat;

        for (let i = 1; i <= seatNumber; i++) {
          const seatEntity = this.seatRepository.create({
            seatNumber: i,
            seatPrice,
            seatGrade,
            showSchedule: schedule,
            show: { showId: showId },
          });

          await queryRunner.manager.save(Seat, seatEntity);
        }
      }

      await queryRunner.commitTransaction();

      return {
        message: '스케쥴과 좌석 등록 완료',
        schedule,
      };
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('스케쥴 및 좌석 생성 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
