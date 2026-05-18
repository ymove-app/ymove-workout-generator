import { YMoveClient } from 'ymove-exercise-api';

// Uses the demo key when YMOVE_API_KEY isn't set so the live demo deploy
// works without a signup. Get a real key at https://ymove.app/exercise-api/signup
// for higher limits (250+ exercises/month vs the demo cap of 10).
const apiKey = process.env.YMOVE_API_KEY || 'demo';

export const ymove = new YMoveClient(apiKey);
