import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './types/categoryRole.type';
import { Seat } from 'src/seat/entities/seat.entity';
import _ from 'lodash';

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
    const show = this.showRepository
      .createQueryBuilder('shows')
      .select([
        'shows.showId',
        'shows.showTitle',
        'shows.showCast',
        'shows.showLocation',
      ]);

    if (search) {
      show.where('shows.showTitle LIKE :search', { search: `%${search}%` });
    }

    const shows = await show.getRawMany();

    return {
      message: '공연 조회 되었습니다.',
      data: shows,
    };
  }

  async detailShow(showId: number) {
    const show = await this.detailShowId(showId);

    return {
      message: '공연 상세 조회 되었습니다.',
      data: show,
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
