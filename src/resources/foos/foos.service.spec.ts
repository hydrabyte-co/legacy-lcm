import { Test, TestingModule } from '@nestjs/testing';
import { FoosService } from './foos.service';

describe('FoosService', () => {
  let service: FoosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoosService],
    }).compile();

    service = module.get<FoosService>(FoosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
