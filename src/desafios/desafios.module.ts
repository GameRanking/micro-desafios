import { Module } from '@nestjs/common';
import { ChallengesService } from './desafios.service';
import { ChallengesController } from './desafios.controller';

@Module({
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class DesafiosModule {}
