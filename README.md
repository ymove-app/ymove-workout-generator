# ymove-workout-generator

Workout-of-the-day generator: pick a muscle group + equipment + difficulty, get a structured workout with sets, reps, and rest times. Built on the [ymove Exercise Video API](https://ymove.app/exercise-api).

## What's in here

- **Next.js 14** + **Tailwind** + **TypeScript**
- Single page renders the form and the generated workout via `getServerSideProps`
- **Tabular set/rep table** (Hevy-style) with `tabular-nums` so the numbers line up
- Uses the official **`ymove-exercise-api`** SDK: `workouts.generate({ muscleGroup, equipment, difficulty, exerciseCount })`
- Shows a clear message instead of an error when the API key is missing

## Run locally

```bash
git clone https://github.com/ymove-app/ymove-workout-generator
cd ymove-workout-generator
npm install
cp .env.example .env.local      # then set YMOVE_API_KEY
npm run dev
```

Open http://localhost:3000.

## Get an API key

Get a free trial key at [ymove.app/exercise-api/signup](https://ymove.app/exercise-api/signup) and put it in `.env.local`:

```
YMOVE_API_KEY=your_key_here
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fymove-app%2Fymove-workout-generator&env=YMOVE_API_KEY&envDescription=Get%20a%20free%20trial%20key%20at%20ymove.app/exercise-api/signup&envLink=https%3A%2F%2Fymove.app%2Fexercise-api%2Fsignup)

## How it works

```ts
import { YMoveClient } from 'ymove-exercise-api';

const ymove = new YMoveClient(process.env.YMOVE_API_KEY ?? '');

const workout = await ymove.workouts.generate({
  muscleGroup: 'chest',
  equipment: 'dumbbell',
  difficulty: 'intermediate',
  exerciseCount: 6,
});

// workout.exercises[].sets   number
// workout.exercises[].reps   string ("8-12")
// workout.exercises[].restSeconds  number
```

## Build with Claude

Hook up the ymove MCP server and ask:

> Add a "save workout" button that calls a /api/save route and stores the workout in localStorage.

Get the MCP config from [github.com/ymove-app/exercise-api-mcp](https://github.com/ymove-app/exercise-api-mcp).

## License

MIT
