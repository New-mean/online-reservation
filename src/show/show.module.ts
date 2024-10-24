import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Show } from './entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, User])],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
