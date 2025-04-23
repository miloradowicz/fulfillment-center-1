import { Test, TestingModule } from '@nestjs/testing';
import { StockManipulationService } from 'src/services/stock-manipulation.service';

describe('StockManipulation2Service', () => {
  let service: StockManipulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockManipulationService],
    })
      .overrideProvider(StockManipulationService)
      .useValue(null)
      .compile();

    service = module.get<StockManipulationService>(StockManipulationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
