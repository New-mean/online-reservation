// // reservation.service.ts
// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, DataSource } from 'typeorm';
// import { Reservation } from './entities/reservation.entity';
// import { Show } from '../show/entities/show.entity';
// import { ShowSchedule } from '../show-schedule/entities/showSchedule.entity';
// import { Seat } from '../seat/entities/seat.entity';
// import { User } from '../users/entities/user.entity';
// import { Point } from '../point/entities/point.entity';

// @Injectable()
// export class ReservationService {
//   constructor(
//     @InjectRepository(Reservation)
//     private reservationRepository: Repository<Reservation>,

//     @InjectRepository(User)
//     private userRepository: Repository<User>,

//     @InjectRepository(Show)
//     private showRepository: Repository<Show>,

//     @InjectRepository(Seat)
//     private seatRepository: Repository<Seat>,

//     @InjectRepository(Point)
//     private pointRepository: Repository<Point>,

//     private dataSource: DataSource,
//   ) {}

//   async createReservation(userId: number, showId: number, showScheduleId: number, seatId: number, totalSeat: number) {
//     const user = await this.userRepository.findOne({ where: { userId }, relations: ['points'] });
//     const show = await this.showRepository.findOne({ where: { showId } });
//     const showSchedule = await this.showRepository.findOne({ where: { showScheduleId } });
//     const seat = await this.seatRepository.findOne({ where: { seatId } });

//     if (!user || !show || !showSchedule || !seat) {
//       throw new NotFoundException('유효한 사용자, 공연, 일정 또는 좌석이 아닙니다.');
//     }

//     const totalCost = seat.seatPrice * totalSeat;
//     const userTotalPoints = user.points.reduce((acc, point) => acc + point.point, 0);

//     if (userTotalPoints < totalCost) {
//       throw new BadRequestException('보유 포인트가 부족하여 예매할 수 없습니다.');
//     }

//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       // 포인트 차감
//       const updatedPoints = userTotalPoints - totalCost;
//       await this.pointRepository.save({ user, point: updatedPoints, reason: '예약' });

//       // 예약 생성
//       const reservation = new Reservation();
//       reservation.user = user;
//       reservation.show = show;
//       reservation.showSchedule = showSchedule;
//       reservation.seat = seat;
//       reservation.totalSeat = totalSeat;
//       reservation.cancle = false;
//       await this.reservationRepository.save(reservation);

//       await queryRunner.commitTransaction();
//       return reservation;
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw new BadRequestException('예약을 생성하는 중 오류가 발생했습니다.');
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async cancelReservation(userId: number, reservationId: number) {
//     const reservation = await this.reservationRepository.findOne({
//       where: { reservationId },
//       relations: ['user', 'showSchedule', 'seat'],
//     });

//     if (!reservation || reservation.user.userId !== userId) {
//       throw new NotFoundException('예약을 찾을 수 없거나 취소 권한이 없습니다.');
//     }

//     const timeDifference = new Date(reservation.showSchedule.showDate).getTime() - new Date().getTime();
//     if (timeDifference < 3 * 60 * 60 * 1000) {
//       throw new BadRequestException('공연 시작 3시간 전까지만 취소가 가능합니다.');
//     }

//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       reservation.cancle = true;
//       await queryRunner.manager.save(reservation);

//       // 포인트 환불
//       const refundPoints = reservation.seat.seatPrice * reservation.totalSeat;
//       await this.pointRepository.save({ user: reservation.user, point: refundPoints, reason: '예약 취소 환불' });

//       await queryRunner.commitTransaction();
//       return { message: '예약이 취소되었습니다.' };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw new BadRequestException('예약을 취소하는 중 오류가 발생했습니다.');
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async getReservationsByUser(userId: number) {
//     return await this.reservationRepository.find({
//       where: { user: { userId } },
//       order: { createdAt: 'DESC' },
//       relations: ['show', 'showSchedule', 'seat'],
//     });
//   }
// }
