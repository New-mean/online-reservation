import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Point } from 'src/point/entities/point.entity';
import _, { indexOf } from 'lodash';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(ShowSchedule)
    private showScheduleRepository: Repository<ShowSchedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findreservation(showId: number) {
    const availableSeats = await this.showRepository.find({
      where: { showId },
      relations: {
        showschdule: true,
      },
      select: {
        showTitle: true,
        showLocation: true,
        showschdule: {
          showScheduleId: true,
          showDate: true,
          showTime: true,
          gradeS: true,
          gradeA: true,
          gradeC: true,
        },
      },
      order: {
        showschdule: { showScheduleId: 'ASC' },
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

  async showReservation(userId: number, showId: number, showScheduleId: number, seatId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { userId: userId },
        relations: { points: true },
      });
      const showSchedule = await this.showScheduleRepository.findOne({
        where: { showScheduleId },
        relations: { show: true },
      });

      if (!user || !showSchedule) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      const seat = await this.seatRepository.findOne({
        where: { seatId: seatId },
      });
      if (!seat) {
        throw new NotFoundException('좌석 Id를 찾을수 없습니다.');
      }
      const totalPrice = seat.seatPrice;

      const ownPoint = user.points.reduce((sum, pointRecord) => sum + pointRecord.point, 0);
      if (ownPoint < totalPrice) {
        throw new BadRequestException('포인트가 부족하여 예매할 수 없습니다.');
      }
      const reserved = await this.reservationRepository.findOne({
        where: { seat: { seatId }, is_Reserved: true },
      });
      if (reserved) {
        throw new BadRequestException('해당 좌석이 이미 예매 되었습니다.');
      }
      await queryRunner.manager.save(Point, {
        user: { userId: user.userId },
        point: ownPoint - totalPrice,
        point_receipt: totalPrice,
        reason: '예매',
        createdAt: new Date(),
      });

      await queryRunner.manager.update(Seat, { seatId: seatId }, { seatNumber: 0 });
      const gradeCounts = { S: 0, A: 0, C: 0 };
      if (seat.seatGrade === 'S') {
        gradeCounts.S -= 1;
      } else if (seat.seatGrade === 'A') {
        gradeCounts.A -= 1;
      } else if (seat.seatGrade === 'C') {
        gradeCounts.C -= 1;
      }

      await queryRunner.manager.update(
        ShowSchedule,
        { showScheduleId },
        {
          gradeS: () => `gradeS + ${gradeCounts.S}`,
          gradeA: () => `gradeA + ${gradeCounts.A}`,
          gradeC: () => `gradeC + ${gradeCounts.C}`,
        },
      );

      const reservation = this.reservationRepository.create({
        user,
        show: showSchedule.show,
        showSchedule,
        seat,
        is_Reserved: true,
        cancle: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await queryRunner.manager.save(reservation);
      await queryRunner.commitTransaction();
      const showreservaions = await this.reservationRepository.find({
        where: {
          show: { showId: reservation.show.showId },
          showSchedule: {
            showScheduleId: reservation.showSchedule.showScheduleId,
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
  async getReservation(userId: number) {
    const reservation = await this.reservationRepository.find({
      where: { user: { userId: userId } },
      relations: { show: true, showSchedule: true, seat: true },
      select: {
        show: {
          showTitle: true,
          showExplain: true,
          showCategory: true,
          showRunTime: true,
        },
        showSchedule: { showDate: true, showTime: true },
        seat: { seatId: true, seatGrade: true },
      },
      order: { createdAt: 'DESC' },
    });

    if (!reservation.length) {
      throw new NotFoundException('예매 내역이 없습니다.');
    }
    return {
      message: '예약 내역입니다.',
      reservation,
    };
  }
  async cancleReservation(userId: number, reservationId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { reservationId: reservationId },
        relations: { user: true, showSchedule: true, seat: true },
      });
      if (!reservation || reservation.user.userId !== userId) {
        throw new NotFoundException('예약을 찾을수 없습니다.');
      }

      const time = new Date(reservation.showSchedule.showDate).getTime() - new Date().getTime();

      if (time < 3 * 60 * 60 * 1000) {
        throw new BadRequestException('공연 시작 3시간 전까지만 취소 가능합니다.');
      }

      const refundPoint = reservation.seat.seatPrice;
      const userPoints = await this.pointRepository.findOne({
        where: { user: { userId } },
        order: { createdAt: 'DESC' },
      });
      const currentTotalPoints = userPoints ? userPoints.point : 0;
      const updatedTotalPoints = currentTotalPoints + refundPoint;

      await queryRunner.manager.save(Point, {
        user: { userId: userId },
        point: updatedTotalPoints,
        point_receipt: refundPoint,
        reason: '환불',
        createdAt: new Date(),
      });
      await queryRunner.manager.update(
        Reservation,
        { reservationId },
        { cancle: true, updatedAt: new Date() },
      );
      await queryRunner.manager.update(
        Seat,
        { seatId: reservation.seat.seatId },
        { seatNumber: reservation.seat.seatNumber + 1 },
      );
      const gradeCounts = { gradeS: 0, gradeA: 0, gradeC: 0 };
      if (reservation.seat.seatGrade === 'S') {
        gradeCounts.gradeS += 1;
      } else if (reservation.seat.seatGrade === 'A') {
        gradeCounts.gradeA += 1;
      } else if (reservation.seat.seatGrade === 'C') {
        gradeCounts.gradeC += 1;
      }

      await queryRunner.manager.update(
        ShowSchedule,
        { showScheduleId: reservation.showSchedule.showScheduleId },
        {
          gradeS: () => `gradeS + ${gradeCounts.gradeS}`,
          gradeA: () => `gradeA + ${gradeCounts.gradeA}`,
          gradeC: () => `gradeC + ${gradeCounts.gradeC}`,
        },
      );

      await queryRunner.commitTransaction();
      return {
        message: '예매 취소되었습니다.',
        data: { reservation },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('예매 취소 중 오류 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
