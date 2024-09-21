import dotenv from 'dotenv';
import { addVote } from './utils';

dotenv.config();

(async () => {
  const surveyUrl = process.env.SURVEY_URL;
  const voteAmount = process.env.VOTE_AMOUNT
    ? parseInt(process.env.VOTE_AMOUNT)
    : 1;

  await addVote(surveyUrl, voteAmount);
})();
