import { Accessibility, Eye, BookOpen, Languages, Keyboard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LANGUAGES, FUTURE_LANGUAGES } from "@/lib/constants";
import { usePreferences, type Preferences } from "@/lib/preferences";

type Row = { key: keyof Preferences; label: string; hint?: string };

function ToggleRow({ row }: { row: Row }) {
  const { prefs, update } = usePreferences();
  const checked = prefs[row.key] as boolean;
  return (
    <label className="flex items-start justify-between gap-4 py-2 cursor-pointer">
      <div className="min-w-0">
        <div className="text-sm font-medium leading-tight">{row.label}</div>
        {row.hint && <div className="text-xs text-muted-foreground mt-0.5">{row.hint}</div>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(v) => update({ [row.key]: v } as Partial<Preferences>)}
        aria-label={row.label}
      />
    </label>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Eye;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="divide-y divide-border/60">{children}</div>
    </section>
  );
}

export function AccessibilityDrawer() {
  const { prefs, update, reset } = usePreferences();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-primary/30 hover:bg-primary/10"
          aria-label="Open Accessibility Mode"
        >
          <Accessibility className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Accessibility Mode</span>
          <span className="sm:hidden" aria-hidden>♿</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-primary" />
            Accessibility Mode
          </SheetTitle>
          <SheetDescription>
            Adapt AccessAI to how you work best. Changes apply immediately — no account needed.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4 pb-10">
          <Section icon={Eye} title="Display">
            <ToggleRow row={{ key: "highContrast", label: "High contrast mode" }} />
            <ToggleRow row={{ key: "largerText", label: "Larger text" }} />
            <ToggleRow row={{ key: "dyslexiaFont", label: "Dyslexia-friendly font" }} />
            <ToggleRow row={{ key: "reducedMotion", label: "Reduced motion" }} />
          </Section>

          <Separator />

          <Section icon={BookOpen} title="Reading & understanding">
            <ToggleRow row={{ key: "readAloud", label: "Read responses aloud" }} />
            <ToggleRow row={{ key: "simplify", label: "Explain in simple language" }} />
            <ToggleRow row={{ key: "beginnerFriendly", label: "Beginner-friendly responses" }} />
            <ToggleRow row={{ key: "highlightImportant", label: "Highlight important information" }} />
          </Section>

          <Separator />

          <Section icon={Languages} title="Language">
            <div className="pt-2 space-y-2">
              <Label>Preferred language</Label>
              <Select value={prefs.language} onValueChange={(v) => update({ language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                  <SelectItem value="__more" disabled>More languages…</SelectItem>
                  {FUTURE_LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l} (preview)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Section>

          <Separator />

          <Section icon={Keyboard} title="Navigation">
            <ToggleRow row={{ key: "keyboardTips", label: "Keyboard navigation tips" }} />
            <ToggleRow row={{ key: "focusIndicators", label: "Focus indicators" }} />
            <ToggleRow row={{ key: "largerTargets", label: "Larger click targets" }} />
          </Section>

          <Separator />

          <Section icon={Save} title="Workspace">
            <ToggleRow
              row={{
                key: "savePrefs",
                label: "Save accessibility preferences for this session",
                hint: "Kept on this device only. No account required.",
              }}
            />
          </Section>

          {prefs.keyboardTips && (
            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">Keyboard tips</div>
              <div><kbd className="px-1 border rounded">Tab</kbd> move focus · <kbd className="px-1 border rounded">Shift+Tab</kbd> back</div>
              <div><kbd className="px-1 border rounded">Enter</kbd> activate · <kbd className="px-1 border rounded">Esc</kbd> close panels</div>
              <div><kbd className="px-1 border rounded">/</kbd> jump to inputs when supported</div>
            </div>
          )}

          <Separator />
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset to defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}