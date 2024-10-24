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
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types/userRole.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(RolesGuard)
@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Roles(Role.Admin)
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
    );
  }
}
