import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './desafios.service';

describe('DesafiosService', () => {
  let service: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengesService],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
