import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from '../desafios/interfaces/desafio.interface';
import { Model } from 'mongoose';
import { Match } from './interfaces/partida.interface';
import { ClientProxyGameRanking } from '../proxyrmq/client-proxy';
import { InjectModel } from '@nestjs/mongoose';
import { errorInstance } from '../common/ErrorInstance';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxyGameRanking: ClientProxyGameRanking,
  ) {
    this.clientChallenges =
      this.clientProxyGameRanking.getClientProxyChallengesInstance();
  }
  private clientChallenges;

  private readonly logger = new Logger(MatchesService.name);

  async criarPartida(match: Match): Promise<Match> {
    try {
      /*
                Iremos persistir a partida e logo em seguida atualizaremos o
                desafio. O desafio irá receber o ID da partida e seu status
                será modificado para REALIZADO.
        */
      const createdMatch = new this.matchModel(match);
      this.logger.log(`partidaCriada: ${JSON.stringify(createdMatch)}`);
      /*
                Recuperamos o ID da partida
        */
      const result = await createdMatch.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const idMatch = result._id;
      /*
                Com o ID do desafio que recebemos na requisição, recuperamos o 
                desafio.
        */
      const challenge: Challenge = await this.clientChallenges
        .send('consultar-desafios', { idJogador: '', _id: match.challenge })
        .toPromise();
      /*
                Acionamos o tópico 'atualizar-desafio-partida' que será
                responsável por atualizar o desafio.
            */
      return await this.clientChallenges
        .emit('atualizar-desafio-partida', {
          idPartida: idMatch,
          desafio: challenge,
        })
        .toPromise();
    } catch (error) {
      const message = errorInstance(error);
      this.logger.error(`error: ${JSON.stringify(message)}`);
      throw new RpcException(message);
    }
  }
}
