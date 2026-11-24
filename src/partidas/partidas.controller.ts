import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MatchesService } from './partidas.service';
import type { Match } from './interfaces/partida.interface';
import { errorInstance } from '../common/ErrorInstance';

const ackErrors: string[] = ['E11000'];

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  private readonly logger = new Logger(MatchesController.name);

  @EventPattern('criar-partida')
  async createMatch(@Payload() match: Match, @Ctx() rawContext: unknown) {
    const context: RmqContext = rawContext as RmqContext;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`match: ${JSON.stringify(match)}`);

      await this.matchesService.createMatch(match);
      await channel.ack(originalMsg);
    } catch (error) {
      const message = errorInstance(error);

      this.logger.log(`error: ${JSON.stringify(message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
