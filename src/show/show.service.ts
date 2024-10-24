import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './types/categoryRole.type';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
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
    await this.showRepository.save({
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

    return {
      message: '공연등록 완료',
    };
  }
}
