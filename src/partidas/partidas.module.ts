import { Module } from '@nestjs/common';
import { MatchesController } from './partidas.controller';
import { MatchesService } from './partidas.service';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/patida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
    ProxyRMQModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
