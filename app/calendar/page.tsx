"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

type Log = {
  date: string;
  creatine: boolean;
  intermittent_fasting: boolean;
  workout_completed: boolean;
  steps: number | null;
  sleep: number | null;
  water: number | null;
};

export default function Calendar() {
  const [logs, setLogs] =
    useState<Log[]>([]);

  useEffect(() => {
    async function load() {
      const { data } =
        await supabase
          .from("daily_logs")
          .select(
            "date,creatine,intermittent_fasting,workout_completed,steps,sleep,water"
          )
          .order("date", {
            ascending: false,
          });

      setLogs(data || []);
    }

    load();
  }, []);

  return (
    <AppShell>

      <header className="page-header">
        <span className="eyebrow">
          CONSISTENCY
        </span>

        <h1>Calendar</h1>

        <p>
          Every good day compounds.
        </p>
      </header>

      <div className="calendar-summary">

        <div>
          <strong>{logs.length}</strong>
          <span>Check-ins</span>
        </div>

        <div>
          <strong>
            {
              logs.filter(
                (x) =>
                  habitScore(x) >= 4
              ).length
            }
          </strong>

          <span>Good days</span>
        </div>

      </div>

      <div className="calendar-log">

        {logs.length === 0 && (
          <div className="empty-state">
            Start your first check-in.
          </div>
        )}

        {logs.map((log) => {
          const score =
            habitScore(log);

          return (
            <div
              className="calendar-row"
              key={log.date}
            >

              <div
                className={`calendar-indicator level-${score}`}
              />

              <div className="calendar-date">
                <strong>
                  {formatDate(log.date)}
                </strong>

                <span>
                  {score}/6 habits
                </span>
              </div>

              <strong className="calendar-score">
                {Math.round(
                  (score / 6) * 100
                )}
                %
              </strong>

            </div>
          );
        })}

      </div>

    </AppShell>
  );
}

function habitScore(log: Log) {
  let score = 0;

  if (log.creatine) score++;
  if (log.intermittent_fasting)
    score++;

  if (log.workout_completed)
    score++;

  if ((log.steps || 0) >= 8000)
    score++;

  if ((log.sleep || 0) >= 7)
    score++;

  if ((log.water || 0) >= 2)
    score++;

  return score;
}

function formatDate(date: string) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}