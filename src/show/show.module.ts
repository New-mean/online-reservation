import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Show } from './entities/show.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, User, Seat])],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
