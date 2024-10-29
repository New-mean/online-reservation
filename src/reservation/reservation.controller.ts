import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Show } from 'src/show/entities/show.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types/userRole.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { ShowSchedule } from 'src/show-schedule/entities/showSchedule.entity';

@UseGuards(RolesGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // @Get(':showId')
  // async findreservation(@Param('showId') showId: number) {
  //   return await this.reservationService.findreservation(showId);
  // }

  // @Roles(Role.User)
  // @Post(':showId')
  // async showReservation(
  //   @UserInfo() user: User,
  //   @Param('showId') showId: number,
  //   @Body() createReservationDto: CreateReservationDto,
  // ) {
  //   return this.reservationService.showReservation(
  //     user.userId,
  //     showId,
  //     createReservationDto.grade,
  //     createReservationDto.totalSeat,
  //   );
  // }

  // @Get()
  // findAll() {
  //   return this.reservationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reservationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return this.reservationService.update(+id, updateReservationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservationService.remove(+id);
  // }
}
