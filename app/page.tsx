"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

const START = 77;
const GOAL = 65;

type Log = {
  date: string;
  weight: number | null;
  calories: number | null;
  protein: number | null;
  steps: number | null;
  water: number | null;
  sleep: number | null;
  creatine: boolean | null;
  intermittent_fasting: boolean | null;
  workout_completed: boolean | null;
};

export default function Home() {
  const [log, setLog] =
    useState<Log | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const { data } =
        await supabase
          .from("daily_logs")
          .select("*")
          .not("weight", "is", null)
          .order("date", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      setLog(data);
      setLoading(false);
    }

    load();
  }, []);

  const current =
    Number(log?.weight) || START;

  const lost =
    Math.max(0, START - current);

  const remaining =
    Math.max(0, current - GOAL);

  const progress =
    Math.min(
      100,
      Math.max(
        0,
        (lost / (START - GOAL)) * 100
      )
    );

  return (
    <AppShell>

      <Header />

      <section className="journey-card">

        <div className="journey-top">
          <div>
            <span className="eyebrow">
              CURRENT WEIGHT
            </span>

            <div className="big-weight">
              {loading
                ? "—"
                : current.toFixed(1)}

              <small>kg</small>
            </div>
          </div>

          <div className="goal">
            <span>GOAL</span>
            <strong>65 kg</strong>
          </div>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="progress-info">
          <span>
            {lost.toFixed(1)} kg lost
          </span>

          <span>
            {remaining.toFixed(1)} kg left
          </span>
        </div>

      </section>

      <div className="section-title-row">
        <div>
          <span className="eyebrow">
            TODAY
          </span>

          <h2>Daily overview</h2>
        </div>

        <span className="date-chip">
          15 SEP
        </span>
      </div>

      <div className="overview-grid">

        <OverviewCard
          label="Calories"
          value={
            log?.calories
              ? log.calories.toLocaleString()
              : "—"
          }
          target="/ 1,750 kcal"
        />

        <OverviewCard
          label="Protein"
          value={
            log?.protein
              ? `${log.protein} g`
              : "—"
          }
          target="/ 130 g"
        />

        <OverviewCard
          label="Steps"
          value={
            log?.steps
              ? log.steps.toLocaleString()
              : "—"
          }
          target="/ 8,000"
        />

        <OverviewCard
          label="Water"
          value={
            log?.water
              ? `${log.water} L`
              : "—"
          }
          target="/ 2 L"
        />

      </div>

      <div className="section-title">
        <span className="eyebrow">
          DAILY HABITS
        </span>

        <h2>Stay consistent</h2>
      </div>

      <div className="home-habits">

        <HabitStatus
          title="Creatine"
          subtitle="3–5g"
          done={!!log?.creatine}
        />

        <HabitStatus
          title="IF 16:8"
          subtitle="Fasting"
          done={
            !!log?.intermittent_fasting
          }
        />

        <HabitStatus
          title="Workout"
          subtitle="Training"
          done={
            !!log?.workout_completed
          }
        />

        <HabitStatus
          title="Sleep"
          subtitle="7h+"
          done={
            Number(log?.sleep || 0) >= 7
          }
        />

      </div>

      <section className="workout-preview">

        <div>
          <span className="eyebrow">
            TODAY&apos;S WORKOUT
          </span>

          <h2>Upper Body</h2>

          <p>
            Dumbbell • 6 exercises
          </p>
        </div>

        <a
          href="/workout"
          className="workout-arrow"
        >
          →
        </a>

      </section>

    </AppShell>
  );
}

function Header() {
  return (
    <header className="header">

      <div>
        <span className="eyebrow">
          15 SEP 2026 — 1 JAN 2027
        </span>

        <h1>CutTrack</h1>
      </div>

      <div className="avatar">
        IF
      </div>

    </header>
  );
}

function OverviewCard({
  label,
  value,
  target,
}: {
  label: string;
  value: string;
  target: string;
}) {
  return (
    <div className="overview-card">

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{target}</small>

    </div>
  );
}

function HabitStatus({
  title,
  subtitle,
  done,
}: {
  title: string;
  subtitle: string;
  done: boolean;
}) {
  return (
    <div className="home-habit-row">

      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <div
        className={`status-dot ${
          done ? "done" : ""
        }`}
      >
        {done ? "✓" : ""}
      </div>

    </div>
  );
}