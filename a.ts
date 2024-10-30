// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, DataSource } from 'typeorm';
// import { Reservation } from './entities/reservation.entity';
// import { User } from 'src/users/entities/user.entity';
// import { Seat } from 'src/seat/entities/seat.entity';
// import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';
// import { Show } from 'src/show/entities/show.entity';

// @Injectable()
// export class ReservationService {
//   constructor(
//     @InjectRepository(Reservation)
//     private reservationRepository: Repository<Reservation>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Seat)
//     private seatRepository: Repository<Seat>,
//     @InjectRepository(ShowSchedule)
//     private showScheduleRepository: Repository<ShowSchedule>,
//     private dataSource: DataSource,
//   ) {}

//   // 1. 공연 예매 API
//   async reserveShow(
//     userId: number,
//     showId: number,
//     seatGrade: string,
//     requestedSeats: number,
//   ) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const user = await this.userRepository.findOne({ where: { id: userId } });
//       const show = await this.showScheduleRepository.findOne({
//         where: { id: showId },
//         relations: ['show'],
//       });
//       const seat = await this.seatRepository.findOne({
//         where: { grade: seatGrade, show: { id: showId } },
//       });

//       if (!user || !show || !seat)
//         throw new NotFoundException('예약 정보를 찾을 수 없습니다.');

//       if (user.point < seat.seat_price * requestedSeats) {
//         throw new BadRequestException('포인트가 부족하여 예매할 수 없습니다.');
//       }

//       if (seat.seat_num < requestedSeats) {
//         throw new BadRequestException(
//           '해당 등급 좌석이 부족하여 예매할 수 없습니다.',
//         );
//       }

//       await queryRunner.manager.update(
//         User,
//         { id: userId },
//         { point: user.point - seat.seat_price * requestedSeats },
//       );
//       await queryRunner.manager.update(
//         Seat,
//         { id: seat.id },
//         { seat_num: seat.seat_num - requestedSeats },
//       );

//       const reservation = this.reservationRepository.create({
//         user,
//         show,
//         seat,
//         grade: seatGrade,
//         totalSeat: requestedSeats,
//         cancle: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       await queryRunner.manager.save(reservation);
//       await queryRunner.commitTransaction();

//       return { message: '예매 성공', reservation };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw error instanceof BadRequestException
//         ? error
//         : new InternalServerErrorException('서버 에러가 발생했습니다.');
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   // 2. 예매 목록 확인 API
//   async getUserReservations(userId: number) {
//     const reservations = await this.reservationRepository.find({
//       where: { user: { id: userId } },
//       relations: ['showSchedule', 'seat', 'show'],
//       order: { createdAt: 'DESC' },
//     });

//     if (!reservations.length)
//       throw new NotFoundException('예매 내역이 없습니다.');
//     return reservations;
//   }

//   // 3. 예매 취소 API
//   async cancelReservation(reservationId: number, userId: number) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const reservation = await this.reservationRepository.findOne({
//         where: { reservationId, user: { id: userId } },
//         relations: ['showSchedule', 'seat'],
//       });
//       if (!reservation)
//         throw new NotFoundException('해당 예매 내역을 찾을 수 없습니다.');

//       const now = new Date();
//       const showDate = new Date(
//         `${reservation.showSchedule.show_date}T${reservation.showSchedule.show_time}`,
//       );
//       showDate.setHours(showDate.getHours() - 3);

//       if (now > showDate)
//         throw new BadRequestException(
//           '공연 3시간 전까지만 취소할 수 있습니다.',
//         );

//       const user = await this.userRepository.findOne({ where: { id: userId } });
//       if (!user) throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');

//       await queryRunner.manager.update(
//         User,
//         { id: userId },
//         {
//           point:
//             user.point + reservation.seat.seat_price * reservation.totalSeat,
//         },
//       );
//       await queryRunner.manager.update(
//         Reservation,
//         { reservationId },
//         { cancle: true, updatedAt: new Date() },
//       );
//       await queryRunner.manager.update(
//         Seat,
//         { id: reservation.seat.id },
//         { seat_num: reservation.seat.seat_num + reservation.totalSeat },
//       );
//       await queryRunner.commitTransaction();

//       return { message: '예매가 성공적으로 취소되었습니다.' };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw error instanceof BadRequestException
//         ? error
//         : new InternalServerErrorException('서버 에러가 발생했습니다.');
//     } finally {
//       await queryRunner.release();
//     }
//   }
// }
