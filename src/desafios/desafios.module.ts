import { Module } from '@nestjs/common';
import { ChallengesService } from './desafios.service';
import { ChallengesController } from './desafios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/desafio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class DesafiosModule {}
