import { YMoveClient } from 'ymove-exercise-api';

// Your API key, read on the server only. Get a free trial key at
// https://ymove.app/exercise-api/signup and put it in .env.local.
export const apiKey = process.env.YMOVE_API_KEY?.trim() ?? '';

export const ymove = new YMoveClient(apiKey);

export const MISSING_KEY_MESSAGE =
  'Add your API key first: copy .env.example to .env.local, set YMOVE_API_KEY and restart the dev server. Get a free trial key at ymove.app/exercise-api/signup';
