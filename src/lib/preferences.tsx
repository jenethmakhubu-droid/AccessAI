import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ReadingLevel, WorkplaceProfile } from "./constants";

export type Preferences = {
  language: string;
  readingLevel: ReadingLevel;
  highContrast: boolean;
  largerText: boolean;
  readAloud: boolean;
  simplify: boolean;
  workplaceProfile?: WorkplaceProfile;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  highlightImportant: boolean;
  beginnerFriendly: boolean;
  keyboardTips: boolean;
  focusIndicators: boolean;
  largerTargets: boolean;
  savePrefs: boolean;
};

const DEFAULTS: Preferences = {
  language: "English",
  readingLevel: "Standard",
  highContrast: false,
  largerText: false,
  readAloud: false,
  simplify: false,
  dyslexiaFont: false,
  reducedMotion: false,
  highlightImportant: false,
  beginnerFriendly: false,
  keyboardTips: false,
  focusIndicators: false,
  largerTargets: false,
  savePrefs: true,
};

const KEY = "accessai:prefs";

type Ctx = {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
  reset: () => void;
};

const PreferencesContext = createContext<Ctx | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (prefs.savePrefs) localStorage.setItem(KEY, JSON.stringify(prefs));
      else localStorage.removeItem(KEY);
    } catch {}
    const root = document.documentElement;
    root.classList.toggle("high-contrast", prefs.highContrast);
    root.classList.toggle("large-text", prefs.largerText);
    root.classList.toggle("dyslexia-font", prefs.dyslexiaFont);
    root.classList.toggle("reduced-motion", prefs.reducedMotion);
    root.classList.toggle("highlight-important", prefs.highlightImportant);
    root.classList.toggle("focus-indicators", prefs.focusIndicators);
    root.classList.toggle("larger-targets", prefs.largerTargets);
  }, [prefs, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      prefs,
      update: (patch) => setPrefs((p) => ({ ...p, ...patch })),
      reset: () => setPrefs(DEFAULTS),
    }),
    [prefs],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

export function speak(text: string, lang = "en-US") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}