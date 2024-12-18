import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { Role } from './types/categoryRole.type';
import { Seat } from 'src/seat/entities/seat.entity';
import _ from 'lodash';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
  ) {}

  async createShow(
    userId: number,
    showTitle: string,
    showExplain: string,
    showCast: string,
    showPrice: number,
    showImage: string,
    showRunTime: string,
    showCategory: Role,
    showLocation: string,
  ) {
    const existingShow = await this.showRepository.findOne({
      where: { showTitle },
    });
    if (existingShow) {
      throw new ConflictException('이미 등록된 showTitle입니다.');
    }

    const show = await this.showRepository.save({
      userId: userId,
      showTitle,
      showExplain,
      showCast,
      showPrice,
      showImage,
      showRunTime,
      showCategory,
      showLocation,
    });
    const shows = await this.showRepository.find({
      select: { showTitle: true, showId: true },
    });

    return {
      message: '공연등록 완료',
      shows,
    };
  }

  async findShow(search: Role) {
    const show = await this.showRepository.find({
      where: { showCategory: search },
      relations: { showschdule: true },
      select: {
        showId: true,
        showTitle: true,
        showCast: true,
        showLocation: true,
      },
    });

    if (show.length === 0) {
      throw new BadRequestException('공연이 없습니다.');
    }

    return {
      message: '공연 조회 되었습니다.',
      show,
    };
  }

  async detailShow(showId: number) {
    const show = await this.detailShowId(showId);
    const data = await this.showRepository.find({
      where: { showId: showId },
      relations: { showschdule: true },
      select: {
        showTitle: true,
        showExplain: true,
        showCast: true,
        showPrice: true,
        showImage: true,
        showRunTime: true,
        showCategory: true,
        showLocation: true,
      },
    });
    return {
      message: '공연 상세 조회 되었습니다.',
      data,
    };
  }

  async findreservation(showId: number) {
    const availableSeats = await this.seatRepository.find({
      where: { show: { showId } },
      relations: {
        show: { showschdule: true },
      },
      select: {
        seatId: true,
        seatGrade: true,
        seatNumber: true,
        seatPrice: true,
        show: {
          showId: true,
          showschdule: {
            showScheduleId: true,
            showDate: true,
            showTime: true,
          },
        },
      },
      order: {
        seatNumber: 'DESC',
      },
    });
    if (availableSeats.length === 0) {
      throw new BadRequestException('예매 가능한 좌석이 없습니다.');
    }

    return {
      message: '예매 가능한 좌석 조회 완료',
      data: availableSeats,
    };
  }

  private async detailShowId(showId: number) {
    const show = await this.showRepository.findOneBy({ showId });
    if (_.isNil(show)) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    return show;
  }
}
