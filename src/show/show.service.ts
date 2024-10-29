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
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
  ) {}

  // 공연 등록
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
    seatInfo: any[],
  ) {
    const existingShow = await this.findByshowTitle(showTitle);
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

    console.log(seatInfo);
    const seats = seatInfo.map((seat) => {
      const { seatNumber, seatPrice, seatGrade } = seat;
      const seatEntity = this.seatRepository.create({
        seatNumber,
        seatPrice,
        seatGrade,
      });
      seatEntity.show = show;
      return seatEntity;
    });

    await this.seatRepository.save(seats);

    return {
      message: '공연등록 완료',
      show,
    };
  }

  // 공연 목록 조회
  async findShow(search: Role) {
    const show = await this.showRepository.find({
      where: { showCategory: search },
      relations: { showschdule: true },
      select: {
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

  // 공연 상세 조회
  async detailShow(showId: number) {
    const show = await this.detailShowId(showId);
    const data = await this.showRepository.find({
      where: { showId: showId },
      relations: { showschdule: true, seat: true },
      select: {
        showTitle: true,
        showExplain: true,
        showCast: true,
        showPrice: true,
        showImage: true,
        showRunTime: true,
        showCategory: true,
        showLocation: true,
        seat: {
          seatId: true,
          seatNumber: true,
          seatPrice: true,
          seatGrade: true,
        },
      },
    });
    return {
      message: '공연 상세 조회 되었습니다.',
      data,
    };
  }

  private async detailShowId(showId: number) {
    const show = await this.showRepository.findOneBy({ showId });
    if (_.isNil(show)) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    return show;
  }

  async findByshowTitle(showTitle: string) {
    return await this.showRepository.findBy({ showTitle });
  }
}
