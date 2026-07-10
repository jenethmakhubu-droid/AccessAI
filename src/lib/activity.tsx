import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Activity = {
  id: string;
  type: "email" | "meeting" | "planner" | "research" | "simplify" | "chat";
  label: string;
  at: number;
};

const KEY = "accessai:activity";

type Ctx = {
  activities: Activity[];
  log: (type: Activity["type"], label: string) => void;
  clear: () => void;
};

const ActivityContext = createContext<Ctx | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setActivities(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(activities));
    } catch {}
  }, [activities, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      activities,
      log: (type, label) =>
        setActivities((a) => [
          { id: Math.random().toString(36).slice(2), type, label, at: Date.now() },
          ...a,
        ].slice(0, 20)),
      clear: () => setActivities([]),
    }),
    [activities],
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}