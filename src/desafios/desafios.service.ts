import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge } from './interfaces/desafio.interface';
import { Model } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { RpcException } from '@nestjs/microservices';
import { errorInstance } from '../common/ErrorInstance';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    this.logger.log(challenge);
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.dateTimeRequest = new Date();
      /*
                Quando um desafio for criado, definimos o status 
                desafio como pendente
            */
      createdChallenge.status = ChallengeStatus.PENDENTE;
      this.logger.log(`Desafio criado: ${JSON.stringify(createdChallenge)}`);
      return await createdChallenge.save();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async findAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async findChallengeOfPlayer(_id: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async findChallengeById(_id: any): Promise<Challenge | null> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
    try {
      /*
                Atualizaremos a data da resposta quando o status do desafio 
                vier preenchido 
            */
      challenge.dateTimeResponse = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async updateChallengeMatch(
    idMatch: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      /*
                Quando uma partida for registrada por um usuário, mudaremos o 
                status do desafio para realizado
        */
      challenge.status = ChallengeStatus.REALIZADO;
      challenge.match = idMatch;
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;
      /*
                Realizaremos a deleção lógica do desafio, modificando seu status para
                CANCELADO
        */
      challenge.status = ChallengeStatus.CANCELADO;
      this.logger.log(`desafio: ${JSON.stringify(challenge)}`);
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }
}
