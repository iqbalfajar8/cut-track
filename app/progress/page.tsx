"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

type Log = {
  date: string;
  weight: number | null;
  waist: number | null;
};

const START = 77;
const GOAL = 65;

export default function Progress() {
  const [logs, setLogs] =
    useState<Log[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } =
        await supabase
          .from("daily_logs")
          .select(
            "date,weight,waist"
          )
          .not("weight", "is", null)
          .order("date", {
            ascending: true,
          });

      if (!error) {
        setLogs(data || []);
      }
    }

    load();
  }, []);

  const latest =
    logs.length > 0
      ? Number(
          logs[logs.length - 1].weight
        )
      : START;

  const lost =
    Math.max(0, START - latest);

  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        (lost / (START - GOAL)) *
          100
      )
    );

  return (
    <AppShell>

      <header className="page-header">
        <span className="eyebrow">
          YOUR JOURNEY
        </span>

        <h1>Progress</h1>

        <p>
          Focus on the trend, not one day.
        </p>
      </header>

      <section className="progress-hero">

        <div className="progress-circle">
          <strong>
            {Math.round(percentage)}%
          </strong>

          <span>complete</span>
        </div>

        <div>
          <span className="eyebrow">
            CURRENT
          </span>

          <div className="progress-weight">
            {latest.toFixed(1)}
            <small> kg</small>
          </div>

          <p>
            {lost.toFixed(1)} kg lost
          </p>
        </div>

      </section>

      <div className="stats-grid">

        <div className="stat-card">
          <span>START</span>
          <strong>77 kg</strong>
        </div>

        <div className="stat-card">
          <span>GOAL</span>
          <strong>65 kg</strong>
        </div>

        <div className="stat-card">
          <span>LOST</span>
          <strong>
            {lost.toFixed(1)} kg
          </strong>
        </div>

        <div className="stat-card">
          <span>REMAINING</span>
          <strong>
            {Math.max(
              0,
              latest - GOAL
            ).toFixed(1)}{" "}
            kg
          </strong>
        </div>

      </div>

      <section className="history-section">

        <div className="section-title">
          <span className="eyebrow">
            WEIGHT HISTORY
          </span>

          <h2>Recent check-ins</h2>
        </div>

        {logs.length === 0 && (
          <div className="empty-state">
            No weight data yet.
          </div>
        )}

        {[...logs]
          .reverse()
          .slice(0, 10)
          .map((log) => (
            <div
              className="history-row"
              key={log.date}
            >
              <span>{log.date}</span>

              <strong>
                {Number(
                  log.weight
                ).toFixed(1)}{" "}
                kg
              </strong>
            </div>
          ))}

      </section>

    </AppShell>
  );
}