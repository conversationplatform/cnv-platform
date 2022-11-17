import { Test, TestingModule } from '@nestjs/testing';
import { HousekeeperService } from './housekeeper.service';

describe('HousekeeperService', () => {
  let service: HousekeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousekeeperService],
    }).compile();

    service = module.get<HousekeeperService>(HousekeeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
