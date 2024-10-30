import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { BAD_DELIMITERS } from 'papaparse';
import { query } from 'express';
import { Point } from 'src/point/entities/point.entity';
import _ from 'lodash';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(ShowSchedule)
    private showScheduleRepository: Repository<ShowSchedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findreservation(showId: number) {
    const availableSeats = await this.seatRepository.find({
      where: {
        show: { showId },
      },
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
        seatNumber: 'ASC',
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
  // async showReservation(
  //   userId: number,
  //   showId: number,
  //   grade: string,
  //   totalSeat: number,
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const user = await this.userRepository.findOne({
  //       where: { userId: userId },
  //       relations: { points: true },
  //     });
  //     const showSchedule = await this.showScheduleRepository.findOne({
  //       where: { show: { showId: showId } },
  //       relations: ['show'],
  //     });
  //     const seat = await this.seatRepository.findOne({
  //       where: { seatGrade: grade, show: { showId: showId } },
  //     });

  //     if (!user || !showSchedule || !seat) {
  //       throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
  //     }

  //     const totalPoint = user.points.reduce(
  //       (sum, pointRecord) => sum + pointRecord.point,
  //       0,
  //     );

  //     // 포인트와 좌석 확인
  //     if (totalPoint < seat.seatPrice * totalSeat) {
  //       throw new BadRequestException('포인트가 부족하여 예매할 수 없습니다.');
  //     }

  //     if (seat.seatNumber < totalSeat) {
  //       throw new BadRequestException('해당 등급 좌석이 부족합니다.');
  //     }

  //     // 포인트 차감
  //     await queryRunner.manager.update(
  //       Point,
  //       { user: { userId: user.userId } },
  //       {
  //         point: totalPoint - seat.seatPrice * totalSeat,
  //         reason: '예약',
  //       },
  //     );

  //     // 좌석 수 차감
  //     await queryRunner.manager.update(
  //       Seat,
  //       { seatId: seat.seatId },
  //       { seatNumber: seat.seatNumber - totalSeat },
  //     );

  //     // 예약 생성
  //     const reservation = this.reservationRepository.create({
  //       user,
  //       show: showSchedule.show,
  //       seat,
  //       grade,
  //       totalSeat,
  //       cancle: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });

  //     // 예약 저장
  //     await queryRunner.manager.save(reservation);
  //     await queryRunner.commitTransaction();

  //     return {
  //       message: '예매 성공',
  //       reservation,
  //     };
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException('예약을 생성하는 중 오류가 발생했습니다.');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async showReservation(
    userId: number,
    showId: number,
    grade: string,
    totalSeat: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { userId: userId },
        relations: { points: true },
      });
      const showSchedule = await this.showScheduleRepository.findOne({
        where: { show: { showId: showId } },
        relations: ['show'],
      });
      const seat = await this.seatRepository.findOne({
        where: { seatGrade: grade, show: { showId: showId } },
      });
      console.log(seat);

      if (!user || !showSchedule || !seat) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      const totalPoint = user.points.reduce(
        (sum, pointRecord) => sum + pointRecord.point,
        0,
      );
      console.log(totalPoint);

      if (totalPoint < seat.seatPrice * totalSeat) {
        throw new BadRequestException('포인트가 부족하여 예매할 수 없습니다.');
      }

      if (seat.seatNumber < totalSeat) {
        throw new BadRequestException('해당 등급 좌석이 부족합니다.');
      }

      // 포인트 차감
      await queryRunner.manager.update(
        Point,
        { user: { userId: user.userId } },
        {
          point: totalPoint - seat.seatPrice * totalSeat,
          reason: '예약',
        },
      );

      // 좌석 수 차감
      await queryRunner.manager.update(
        Seat,
        { seatId: seat.seatId },
        { seatNumber: seat.seatNumber - totalSeat },
      );

      // 예약 생성
      const reservation = this.reservationRepository.create({
        user,
        show: showSchedule.show,
        showSchedule,
        seat,
        grade,
        totalSeat,
        cancle: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const showreservaion = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();
      const showreservaions = await this.reservationRepository.find({
        where: {
          show: { showId: showreservaion.show.showId },
          showSchedule: {
            showScheduleId: showreservaion.showSchedule.showScheduleId,
          },
        },
        select: {
          show: { showLocation: true, showPrice: true },
          showSchedule: { showDate: true },
        },
        relations: { show: true, showSchedule: true },
      });
      return {
        message: '예매 성공',
        showreservaions,
      };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('예약을 생성하는 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

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
