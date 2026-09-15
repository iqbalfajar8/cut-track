"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Form = {
  weight: string;
  waist: string;
  calories: string;
  protein: string;
  steps: string;
  water: string;
  sleep: string;

  creatine: boolean;
  intermittent_fasting: boolean;
  workout_completed: boolean;

  workout_type: string;
  notes: string;
};

const emptyForm: Form = {
  weight: "",
  waist: "",
  calories: "",
  protein: "",
  steps: "",
  water: "",
  sleep: "",

  creatine: false,
  intermittent_fasting: false,
  workout_completed: false,

  workout_type: "",
  notes: "",
};

function localDate() {
  const d = new Date();

  const year = d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DailyCheckin({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const [form, setForm] =
    useState<Form>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const today = localDate();

  useEffect(() => {
    async function load() {
      const { data, error } =
        await supabase
          .from("daily_logs")
          .select("*")
          .eq("date", today)
          .maybeSingle();

      if (error) {
        console.error(error);
        setMessage(error.message);
      }

      if (data) {
        setForm({
          weight:
            data.weight?.toString() ?? "",

          waist:
            data.waist?.toString() ?? "",

          calories:
            data.calories?.toString() ?? "",

          protein:
            data.protein?.toString() ?? "",

          steps:
            data.steps?.toString() ?? "",

          water:
            data.water?.toString() ?? "",

          sleep:
            data.sleep?.toString() ?? "",

          creatine:
            data.creatine ?? false,

          intermittent_fasting:
            data.intermittent_fasting ??
            false,

          workout_completed:
            data.workout_completed ??
            false,

          workout_type:
            data.workout_type ?? "",

          notes:
            data.notes ?? "",
        });
      }

      setLoading(false);
    }

    load();
  }, [today]);

  function set(
    key: keyof Form,
    value: string | boolean
  ) {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  }

  function numberOrNull(
    value: string
  ) {
    if (value.trim() === "") {
      return null;
    }

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : null;
  }

  async function save() {
    setSaving(true);
    setMessage("");

    const payload = {
      date: today,

      weight:
        numberOrNull(form.weight),

      waist:
        numberOrNull(form.waist),

      calories:
        numberOrNull(form.calories),

      protein:
        numberOrNull(form.protein),

      steps:
        numberOrNull(form.steps),

      water:
        numberOrNull(form.water),

      sleep:
        numberOrNull(form.sleep),

      creatine:
        form.creatine,

      intermittent_fasting:
        form.intermittent_fasting,

      workout_completed:
        form.workout_completed,

      workout_type:
        form.workout_completed
          ? form.workout_type || null
          : null,

      notes:
        form.notes || null,

      updated_at:
        new Date().toISOString(),
    };

    const { error } =
      await supabase
        .from("daily_logs")
        .upsert(payload, {
          onConflict: "date",
        });

    if (error) {
      console.error(error);

      setMessage(
        `Error: ${error.message}`
      );

      setSaving(false);
      return;
    }

    setMessage("Check-in saved ✓");
    setSaving(false);

    onSaved?.();
  }

  if (loading) {
    return (
      <div className="loading-card">
        Loading today's data...
      </div>
    );
  }

  return (
    <div className="checkin">

      <div className="checkin-date">
        {today}
      </div>

      <div className="metric-grid">

        <MetricInput
          label="Weight"
          unit="kg"
          value={form.weight}
          step="0.1"
          onChange={(v) =>
            set("weight", v)
          }
        />

        <MetricInput
          label="Waist"
          unit="cm"
          value={form.waist}
          step="0.1"
          onChange={(v) =>
            set("waist", v)
          }
        />

        <MetricInput
          label="Calories"
          unit="kcal"
          value={form.calories}
          onChange={(v) =>
            set("calories", v)
          }
        />

        <MetricInput
          label="Protein"
          unit="g"
          value={form.protein}
          onChange={(v) =>
            set("protein", v)
          }
        />

        <MetricInput
          label="Steps"
          unit=""
          value={form.steps}
          onChange={(v) =>
            set("steps", v)
          }
        />

        <MetricInput
          label="Water"
          unit="L"
          value={form.water}
          step="0.1"
          onChange={(v) =>
            set("water", v)
          }
        />

        <MetricInput
          label="Sleep"
          unit="h"
          value={form.sleep}
          step="0.1"
          onChange={(v) =>
            set("sleep", v)
          }
        />

      </div>

      <div className="habit-section">

        <div className="section-heading">
          DAILY HABITS
        </div>

        <Toggle
          title="Creatine"
          subtitle="3–5g daily"
          checked={form.creatine}
          onClick={() =>
            set(
              "creatine",
              !form.creatine
            )
          }
        />

        <Toggle
          title="Intermittent Fasting"
          subtitle="16:8"
          checked={
            form.intermittent_fasting
          }
          onClick={() =>
            set(
              "intermittent_fasting",
              !form.intermittent_fasting
            )
          }
        />

        <Toggle
          title="Workout"
          subtitle="Training completed"
          checked={
            form.workout_completed
          }
          onClick={() =>
            set(
              "workout_completed",
              !form.workout_completed
            )
          }
        />

      </div>

      {form.workout_completed && (
        <select
          className="select"
          value={form.workout_type}
          onChange={(e) =>
            set(
              "workout_type",
              e.target.value
            )
          }
        >
          <option value="">
            Workout type
          </option>

          <option value="Upper">
            Upper
          </option>

          <option value="Lower">
            Lower
          </option>

          <option value="Full Body">
            Full Body
          </option>

          <option value="Cardio">
            Cardio
          </option>
        </select>
      )}

      <textarea
        className="notes"
        placeholder="Notes for today..."
        value={form.notes}
        onChange={(e) =>
          set("notes", e.target.value)
        }
      />

      <button
        className="primary-button"
        onClick={save}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : "Save Check-in"}
      </button>

      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

    </div>
  );
}

function MetricInput({
  label,
  unit,
  value,
  step = "1",
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  step?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="metric-card">

      <span className="metric-label">
        {label}
      </span>

      <div className="metric-value-row">

        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          placeholder="0"
          onChange={(e) =>
            onChange(e.target.value)
          }
        />

        {unit && (
          <span>{unit}</span>
        )}

      </div>

    </div>
  );
}

function Toggle({
  title,
  subtitle,
  checked,
  onClick,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="habit-row"
      onClick={onClick}
    >
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <div
        className={`toggle ${
          checked ? "on" : ""
        }`}
      >
        <div />
      </div>
    </button>
  );
}