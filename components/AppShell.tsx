"use client";

import BottomNav from "./BottomNav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <main className="app-content">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}