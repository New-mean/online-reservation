import { Test, TestingModule } from '@nestjs/testing';
import { ShowScheduleController } from './show-schedule.controller';
import { ShowScheduleService } from './show-schedule.service';

describe('ShowScheduleController', () => {
  let controller: ShowScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowScheduleController],
      providers: [ShowScheduleService],
    }).compile();

    controller = module.get<ShowScheduleController>(ShowScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
