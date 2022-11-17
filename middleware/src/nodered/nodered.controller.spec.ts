import { Test, TestingModule } from '@nestjs/testing';
import { NoderedController } from './nodered.controller';

describe('NoderedController', () => {
  let controller: NoderedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoderedController],
    }).compile();

    controller = module.get<NoderedController>(NoderedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
