import { Controller, Logger } from '@nestjs/common';
import { ChallengesService } from './desafios.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import type { Challenge } from './interfaces/desafio.interface';
import { errorInstance } from '../common/ErrorInstance';
import type { UpdateChallengeMatch } from '../common/interfaces/updateChallengeMatch.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @EventPattern('criar-desafio')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() rawContext: unknown,
  ) {
    const context: RmqContext = rawContext as RmqContext;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`desafio: ${JSON.stringify(challenge)}`);

      await this.challengesService.createChallenge(challenge);
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

  @MessagePattern('consultar-desafios')
  async findChallenges(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[] | Challenge | null> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { idPlayer, _id } = data;
      this.logger.log(`data: ${JSON.stringify(data)}`);
      if (idPlayer) {
        return await this.challengesService.findChallengeOfPlayer(idPlayer);
      } else if (_id) {
        return await this.challengesService.findChallengeById(_id);
      } else {
        return await this.challengesService.findAllChallenges();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-desafio')
  async updateChallenge(@Payload() data: any, @Ctx() rawContext: unknown) {
    const context: RmqContext = rawContext as RmqContext;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);

      const _id: string = data._id;
      this.logger.log(`id: ${_id}`);
      const challenge: Challenge = data.challenge;

      await this.challengesService.updateChallenge(_id, challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      const message = errorInstance(error);

      const filterAckError = ackErrors.filter((ackError) =>
        message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('atualizar-desafio-partida')
  async updateChallengeMatch(
    @Payload() data: UpdateChallengeMatch,
    @Ctx() rawContext: unknown,
  ) {
    const context: RmqContext = rawContext as RmqContext;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`idPartida: ${JSON.stringify(data)}`);

      const idMatch: string = data.idMatch;
      const challenge: Challenge = data.challenge;

      await this.challengesService.updateChallengeMatch(idMatch, challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      const message = errorInstance(error);
      const filterAckError = ackErrors.filter((ackError) =>
        message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('deletar-desafio')
  async deleteChallenge(
    @Payload() challenge: Challenge,
    @Ctx() rawContext: unknown,
  ) {
    const context: RmqContext = rawContext as RmqContext;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.challengesService.deleteChallenge(challenge);
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
