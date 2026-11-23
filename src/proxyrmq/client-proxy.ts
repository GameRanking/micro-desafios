import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxyGameRanking {
  private user: string;
  private password: string;
  private host: string;
  private vhost: string;
  private rmqProtocol: string;
  private rmqQueueAdminBackend: string;
  private rmqQueueDesafios: string;
  private rmqQueueRankings: string;
  private rmqQueueNotifications: string;

  private url: string;

  constructor(private configService: ConfigService) {
    this.user = this.configService.get<string>('RABBITMQ_USER')!;
    this.password = this.configService.get<string>('RABBITMQ_PASSWORD')!;
    this.host = this.configService.get<string>('RABBITMQ_HOST')!;
    this.vhost = this.configService.get<string>('RABBITMQ_VIRTUAL_HOST')!;
    this.rmqProtocol = this.configService.get<string>('RABBITMQ_PROTOCOL')!;
    this.rmqQueueAdminBackend = this.configService.get<string>(
      'RABBITMQ_QUEUE_ADMIN_BACKEND',
    )!;

    this.rmqQueueDesafios = this.configService.get<string>(
      'RABBITMQ_QUEUE_DESAFIOS',
    )!;
    this.rmqQueueRankings = this.configService.get<string>(
      'RABBITMQ_QUEUE_RANKINGS',
    )!;

    this.rmqQueueNotifications = this.configService.get<string>(
      'RABBITMQ_QUEUE_NOTIFICATIONS',
    )!;

    this.url = `${this.rmqProtocol}${this.user}:${this.password}@${this.host}${this.vhost}`;
  }

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.rmqQueueAdminBackend,
      },
    });
  }

  getClientProxyChallengesInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.rmqQueueDesafios,
      },
    });
  }

  getClientProxyRankingsInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.rmqQueueRankings,
      },
    });
  }

  getClientProxyNotificacoesInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.rmqQueueNotifications,
      },
    });
  }
}
