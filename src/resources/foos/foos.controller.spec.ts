import { Test, TestingModule } from '@nestjs/testing';
import { FoosController } from './foos.controller';
import { FoosService } from './foos.service';

describe('FoosController', () => {
  let controller: FoosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoosController],
      providers: [FoosService],
    }).compile();

    controller = module.get<FoosController>(FoosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
