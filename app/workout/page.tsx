"use client";

import { useState } from "react";

import AppShell from "@/components/AppShell";

const exercises = [
  {
    name: "Dumbbell Floor Press",
    sets: "4 × 10–15",
  },
  {
    name: "One-arm Row",
    sets: "4 × 10–15 / side",
  },
  {
    name: "Shoulder Press",
    sets: "3 × 8–12",
  },
  {
    name: "Lateral Raise",
    sets: "3 × 12–20",
  },
  {
    name: "Biceps Curl",
    sets: "3 × 10–15",
  },
  {
    name: "Triceps Extension",
    sets: "3 × 10–15",
  },
];

export default function Workout() {
  const [completed, setCompleted] =
    useState<number[]>([]);

  function toggle(index: number) {
    setCompleted((old) =>
      old.includes(index)
        ? old.filter((x) => x !== index)
        : [...old, index]
    );
  }

  return (
    <AppShell>

      <PageHeader
        eyebrow="TODAY'S TRAINING"
        title="Upper Body"
        subtitle="Dumbbell 10 kg • 40–50 min"
      />

      <div className="workout-progress">
        <span>
          {completed.length} /{" "}
          {exercises.length}
        </span>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width:
                `${
                  (completed.length /
                    exercises.length) *
                  100
                }%`,
            }}
          />
        </div>
      </div>

      <div className="exercise-list">

        {exercises.map(
          (exercise, index) => {
            const done =
              completed.includes(index);

            return (
              <button
                key={exercise.name}
                className={`exercise-card ${
                  done ? "completed" : ""
                }`}
                onClick={() =>
                  toggle(index)
                }
              >
                <div className="exercise-number">
                  {done
                    ? "✓"
                    : String(index + 1).padStart(
                        2,
                        "0"
                      )}
                </div>

                <div>
                  <strong>
                    {exercise.name}
                  </strong>

                  <span>
                    {exercise.sets}
                  </span>
                </div>

                <div className="exercise-arrow">
                  →
                </div>

              </button>
            );
          }
        )}

      </div>

    </AppShell>
  );
}

function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="page-header">

      <span className="eyebrow">
        {eyebrow}
      </span>

      <h1>{title}</h1>

      <p>{subtitle}</p>

    </header>
  );
}