import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role as userRole } from 'src/users/types/userRole.type';
import { Role as categoryRole } from '../show/types/categoryRole.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(RolesGuard)
@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Roles(userRole.Admin)
  @Post('postshow')
  async create(@UserInfo() user: User, @Body() createShowDto: CreateShowDto) {
    return await this.showService.createShow(
      user.userId,
      createShowDto.showTitle,
      createShowDto.showExplain,
      createShowDto.showCast,
      createShowDto.showPrice,
      createShowDto.showImage,
      createShowDto.showRunTime,
      createShowDto.showCategory,
      createShowDto.showLocation,
      createShowDto.seatInfo,
    );
  }

  @Get()
  async findShow(@Query('search') search: categoryRole) {
    return await this.showService.findShow(search);
  }

  @Get(':showId')
  async detailShow(@Param('showId') showId: number) {
    return await this.showService.detailShow(showId);
  }

  @Get(':showId/reservation')
  async findreservation(@Param('showId') showId: number) {
    return await this.showService.findreservation(showId);
  }
}
