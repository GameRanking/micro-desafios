import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const createMongoOptions = (configService: ConfigService) => {
  const mongoUri = configService.get<string>('DB_CONNECTION');
  if (!mongoUri) {
    throw new Error('DB_CONNECTION is not configured');
  }

  return { uri: mongoUri };
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createMongoOptions(configService),
    }),
    DesafiosModule,
    PartidasModule,
    ProxyRMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
