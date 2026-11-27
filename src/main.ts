import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import moment from 'moment-timezone';

const logger = new Logger('Main');

async function bootstrap() {
  const user = process.env.RABBITMQ_USER;
  const password = process.env.RABBITMQ_PASSWORD;
  const host = process.env.RABBITMQ_HOST;
  const vhost = process.env.RABBITMQ_VIRTUAL_HOST;
  const rmqProtocol = process.env.RABBITMQ_PROTOCOL;
  const rmq_queue = process.env.RABBITMQ_QUEUE_DESAFIOS;

  const url = `${rmqProtocol}${user}:${password}@${host}${vhost}`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        noAck: false, // confirmação para o rmq de que a mensagem foi recebida e processada
        queue: rmq_queue,
      },
    },
  );
  Date.prototype.toJSON = function (): any {
    return moment(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
  logger.log('Microservice challenges is listening');
}
void bootstrap();
