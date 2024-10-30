// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Delete,
//   UseGuards,
//   Req,
//   HttpStatus,
//   HttpException,
// } from '@nestjs/common';
// import { ReservationService } from './reservation.service';
// import { AuthGuard } from 'src/auth/auth.guard';

// @Controller('reservations')
// export class ReservationController {
//   constructor(private readonly reservationService: ReservationService) {}

//   // 1. 공연 예매 API
//   @UseGuards(AuthGuard)
//   @Post('reserve')
//   async reserveShow(
//     @Req() req, // 인증된 사용자 정보를 가져오기 위한 데코레이터
//     @Body()
//     reserveDto: { showId: number; seatGrade: string; requestedSeats: number },
//   ) {
//     const userId = req.user.id;

//     try {
//       const result = await this.reservationService.reserveShow(
//         userId,
//         reserveDto.showId,
//         reserveDto.seatGrade,
//         reserveDto.requestedSeats,
//       );
//       return {
//         statusCode: HttpStatus.CREATED,
//         message: '예매가 성공적으로 완료되었습니다.',
//         data: result,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message,
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // 2. 예매 목록 확인 API
//   @UseGuards(AuthGuard)
//   @Get()
//   async getUserReservations(@Req() req) {
//     const userId = req.user.id;

//     try {
//       const reservations =
//         await this.reservationService.getUserReservations(userId);
//       return {
//         statusCode: HttpStatus.OK,
//         message: '예매 목록을 성공적으로 가져왔습니다.',
//         data: reservations,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message,
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // 3. 예매 취소 API
//   @UseGuards(AuthGuard)
//   @Delete('cancel/:reservationId')
//   async cancelReservation(
//     @Req() req,
//     @Param('reservationId') reservationId: number,
//   ) {
//     const userId = req.user.id;

//     try {
//       const result = await this.reservationService.cancelReservation(
//         reservationId,
//         userId,
//       );
//       return {
//         statusCode: HttpStatus.OK,
//         message: result.message,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message,
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
