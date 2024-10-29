import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private userRepository: Repository<User>,
    private showRepository: Repository<Show>,
    private seatRepository: Repository<Seat>,
    private showScheduleRepository: Repository<ShowSchedule>,
    private readonly dataSource: DataSource,
  ) {}

  // async findreservation(showId: number) {
  //   const availableSeats = await this.seatRepository.find({
  //     where: {
  //       show: { showId },
  //     },
  //     relations: {
  //       showSchedule: true,
  //       reservation: true,
  //       show: true,
  //     },
  //     select: {
  //       seatId: true,
  //       seatGrade: true,
  //       seatNumber: true,
  //       seatPrice: true,
  //       showSchedule: {
  //         showDate: true,
  //         showTime: true,
  //       },
  //     },
  //     order: {
  //       seatNumber: 'ASC',
  //     },
  //   });
  //   if (availableSeats.length === 0) {
  //     throw new BadRequestException('예매 가능한 좌석이 없습니다.');
  //   }

  //   return {
  //     message: '예매 가능한 좌석 조회 완료',
  //     data: availableSeats,
  //   };
  // }

  // async showReservation(
  //   userId: number,
  //   showId: number,
  //   grade: string,
  //   seatNumber: number,
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const show = await this;
  //   } catch (err) {}
  // }

  // findAll() {
  //   return `This action returns all reservation`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} reservation`;
  // }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }
}