import { Document } from 'mongoose';
import { ChallengeStatus } from '../challenge-status.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeResponse?: Date;
  requester: string;
  category: string;
  match?: string;
  players: string[];
}
