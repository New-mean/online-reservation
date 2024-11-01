import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types/userRole.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@UseGuards(RolesGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/available/:showId')
  async findreservation(@Param('showId') showId: number) {
    return await this.reservationService.findreservation(showId);
  }

  @Roles(Role.User)
  @Post(':showId')
  async showReservation(
    @UserInfo() user: User,
    @Param('showId') showId: number,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.showReservation(
      user.userId,
      showId,
      createReservationDto.showScheduleId,
      createReservationDto.seatId,
    );
  }
  @Roles(Role.User)
  @Get('/checkReserve/:userId')
  async getReservation(@UserInfo() user: User, @Param('userId') userId: number) {
    return this.reservationService.getReservation(userId);
  }

  @Delete('/cancle/:reservationId')
  async cancleReservation(@UserInfo() user: User, @Param('reservationId') reservationId: number) {
    return this.reservationService.cancleReservation(user.userId, reservationId);
  }
}
