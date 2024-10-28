import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowSchedule } from './entities/showSchedule.entity';
import { Repository } from 'typeorm';
import { Show } from 'src/show/entities/show.entity';

@Injectable()
export class ShowScheduleService {
  constructor(
    @InjectRepository(ShowSchedule)
    private showScheduleRepository: Repository<ShowSchedule>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
  ) {}

  async createSchedule(showId: number, showDate: string, showTime: string) {
    const show = await this.showRepository.findOne({
      where: { showId },
    });

    if (!show) {
      throw new BadRequestException('해당 showId가 존재하지 않습니다.');
    }

    const schedule = await this.showScheduleRepository.create({
      show,
      showDate,
      showTime,
    });
    await this.showScheduleRepository.save(schedule);

    return {
      messgae: '스케쥴 등록 완료',
      schedule,
    };
  }
}
