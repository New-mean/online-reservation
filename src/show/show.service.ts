import {
  BadRequestException,
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
import { constrainedMemory } from 'process';
import { date } from 'joi';
import { SeatInfoDto } from 'src/seat/dto/create-seat.dto';

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

    // console.log(seatInfo);
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
    };
  }

  // 공연 목록 조회
  async findShow(search: string) {
    console.log(search);
    const show = await this.showRepository.find({
      where: { showTitle: search },
      relations: { showschdule: true },
      // select: {
      //   showTitle: true,
      //   showCast: true,
      // },
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

    return {
      message: '공연 상세 조회 되었습니다.',
      show,
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
