"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import DailyCheckin from "./DailyCheckin";

export default function BottomNav() {
  const pathname = usePathname();

  const [checkinOpen, setCheckinOpen] =
    useState(false);

  return (
    <>
      <nav className="bottom-nav">

        <NavItem
          href="/"
          label="Home"
          icon="⌂"
          active={pathname === "/"}
        />

        <NavItem
          href="/workout"
          label="Workout"
          icon="◇"
          active={pathname === "/workout"}
        />

        <button
          className="nav-add"
          onClick={() =>
            setCheckinOpen(true)
          }
          aria-label="Daily check-in"
        >
          +
        </button>

        <NavItem
          href="/progress"
          label="Progress"
          icon="⌁"
          active={pathname === "/progress"}
        />

        <NavItem
          href="/calendar"
          label="Calendar"
          icon="▦"
          active={pathname === "/calendar"}
        />

      </nav>

      {checkinOpen && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setCheckinOpen(false)
          }
        >
          <div
            className="bottom-sheet"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="sheet-handle" />

            <div className="sheet-top">
              <div>
                <span className="eyebrow">
                  DAILY LOG
                </span>

                <h2>Check-in</h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setCheckinOpen(false)
                }
              >
                ×
              </button>
            </div>

            <DailyCheckin
              onSaved={() => {
                setTimeout(() => {
                  setCheckinOpen(false);
                  window.location.reload();
                }, 500);
              }}
            />

          </div>
        </div>
      )}
    </>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`nav-item ${
        active ? "active" : ""
      }`}
    >
      <span className="nav-icon">
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}