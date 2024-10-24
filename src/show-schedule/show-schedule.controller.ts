// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ShowScheduleService } from './show-schedule.service';
// import { CreateShowScheduleDto } from './dto/create-show-schedule.dto';
// import { UpdateShowScheduleDto } from './dto/update-show-schedule.dto';

// @Controller('show-schedule')
// export class ShowScheduleController {
//   constructor(private readonly showScheduleService: ShowScheduleService) {}

//   @Post()
//   create(@Body() createShowScheduleDto: CreateShowScheduleDto) {
//     return this.showScheduleService.create(createShowScheduleDto);
//   }

//   @Get()
//   findAll() {
//     return this.showScheduleService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.showScheduleService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateShowScheduleDto: UpdateShowScheduleDto) {
//     return this.showScheduleService.update(+id, updateShowScheduleDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.showScheduleService.remove(+id);
//   }
// }
