import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './types/categoryRole.type';
import { Seat } from 'src/seat/entities/seat.entity';

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
}
