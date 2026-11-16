import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [DesafiosModule, PartidasModule, ProxyRMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
