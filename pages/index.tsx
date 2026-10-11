import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { apiKey, MISSING_KEY_MESSAGE, ymove } from '../lib/ymove';
import type { Workout, MuscleGroupSlug, EquipmentSlug, Difficulty } from 'ymove-exercise-api';

interface Props {
  workout: Workout | null;
  params: {
    muscleGroup: MuscleGroupSlug;
    equipment?: EquipmentSlug;
    difficulty: Difficulty;
    exerciseCount: number;
  };
  error: string | null;
}

const MUSCLE_GROUPS: MuscleGroupSlug[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'core',
];
const EQUIPMENT_OPTIONS: Array<EquipmentSlug | 'any'> = ['any', 'barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'cable'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const COUNTS = [4, 5, 6, 8, 10];

export default function Home({ workout, params, error }: Props) {
  return (
    <>
      <Head>
        <title>Workout Generator · ymove example</title>
        <meta name="description" content="Generate a structured workout with sets, reps, and rest times using the ymove API." />
      </Head>

      <main className="mx-auto max-w-2xl px-4 pt-10 pb-20">
        <header className="mb-8">
          <p className="text-sm text-ink-400 tracking-widest uppercase">ymove example</p>
          <h1 className="mt-1 text-3xl font-semibold">Workout Generator</h1>
          <p className="mt-2 text-ink-400 text-sm">
            Pick a muscle group, get sets · reps · rest. Powered by{' '}
            <code className="bg-ink-800 px-1.5 py-0.5 rounded text-xs">workouts.generate()</code>.
          </p>
        </header>

        <form method="GET" action="/" className="space-y-5 mb-10">
          <Selector label="Muscle group" name="muscleGroup" options={MUSCLE_GROUPS} current={params.muscleGroup} />
          <Selector label="Equipment" name="equipment" options={EQUIPMENT_OPTIONS} current={params.equipment ?? 'any'} />
          <Selector label="Difficulty" name="difficulty" options={DIFFICULTIES} current={params.difficulty} />
          <Selector label="Exercises" name="exerciseCount" options={COUNTS.map(String)} current={String(params.exerciseCount)} />
          <button
            type="submit"
            className="w-full rounded-lg bg-lime-500 text-ink-950 font-semibold py-3 hover:brightness-110 transition"
          >
            Generate workout
          </button>
        </form>

        {error && (
          <p className="rounded-lg bg-red-950 text-red-200 p-4 text-sm">{error}</p>
        )}

        {workout && (
          <section className="rounded-2xl bg-ink-900 border border-ink-800 overflow-hidden">
            <header className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{workout.name}</h2>
                <p className="text-xs text-ink-400 mt-0.5 tabular-nums">
                  {workout.exercises.length} exercises · ~{workout.estimatedMinutes} min · {workout.difficulty}
                </p>
              </div>
              <Link
                href={`/?muscleGroup=${params.muscleGroup}&equipment=${params.equipment ?? 'any'}&difficulty=${params.difficulty}&exerciseCount=${params.exerciseCount}&r=${Date.now()}`}
                className="text-xs text-lime-500 hover:underline"
              >
                Regenerate
              </Link>
            </header>

            <ol className="divide-y divide-ink-800">
              {workout.exercises.map((we, i) => (
                <li key={we.exercise.id ?? i} className="p-5">
                  <div className="flex gap-4 items-start">
                    {we.exercise.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={we.exercise.thumbnailUrl}
                        alt=""
                        className="h-16 w-16 rounded object-cover bg-ink-800 shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded bg-ink-800 shrink-0 flex items-center justify-center text-xs text-ink-400 tabular-nums">
                        {i + 1}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-medium">{we.exercise.title}</h3>
                      <p className="text-xs text-ink-400 mt-0.5">
                        {we.exercise.muscleGroup}
                        {we.exercise.equipment ? <> · {we.exercise.equipment}</> : null}
                      </p>

                      {/* Tabular set/reps table — Hevy pattern */}
                      <table className="mt-3 w-full text-sm tabular-nums">
                        <thead>
                          <tr className="text-xs uppercase tracking-widest text-ink-400">
                            <th className="text-left font-normal pb-1 w-12">Set</th>
                            <th className="text-left font-normal pb-1">Reps</th>
                            <th className="text-right font-normal pb-1">Rest</th>
                          </tr>
                        </thead>
                        <tbody className="text-ink-200">
                          {Array.from({ length: we.sets }).map((_, setIdx) => (
                            <tr key={setIdx}>
                              <td className="py-0.5 text-ink-400">{setIdx + 1}</td>
                              <td className="py-0.5">{we.reps}</td>
                              <td className="py-0.5 text-right">{we.restSeconds}s</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </>
  );
}

function Selector({ label, name, options, current }: { label: string; name: string; options: string[]; current: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ink-400 block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              defaultChecked={opt === current}
              className="peer sr-only"
            />
            <span className="rounded-full bg-ink-800 text-ink-200 px-3 py-1.5 text-sm peer-checked:bg-ink-200 peer-checked:text-ink-950 inline-block">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const params = {
    muscleGroup: (typeof query.muscleGroup === 'string' ? query.muscleGroup : 'chest') as MuscleGroupSlug,
    equipment: typeof query.equipment === 'string' && query.equipment !== 'any'
      ? (query.equipment as EquipmentSlug)
      : undefined,
    difficulty: (typeof query.difficulty === 'string' ? query.difficulty : 'intermediate') as Difficulty,
    exerciseCount: typeof query.exerciseCount === 'string' ? parseInt(query.exerciseCount, 10) : 6,
  };

  if (!apiKey) {
    return { props: { workout: null, params, error: MISSING_KEY_MESSAGE } };
  }

  try {
    const workout = await ymove.workouts.generate(params);
    return { props: { workout, params, error: null } };
  } catch (e: any) {
    return {
      props: {
        workout: null,
        params,
        error: e?.message ?? 'Failed to generate workout',
      },
    };
  }
};
