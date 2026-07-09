import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  FUTURE_LANGUAGES,
  LANGUAGES,
  READING_LEVELS,
  WORKPLACE_PROFILES,
} from "@/lib/constants";
import { usePreferences } from "@/lib/preferences";

export function PreferencesSheet() {
  const { prefs, update, reset } = usePreferences();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Preferences</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Personal preferences</SheetTitle>
          <SheetDescription>
            Customise your session. No account needed — settings stay on this device.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4 pb-8">
          <div className="space-y-2">
            <Label>Workplace profile (optional)</Label>
            <Select
              value={prefs.workplaceProfile ?? "none"}
              onValueChange={(v) =>
                update({ workplaceProfile: v === "none" ? undefined : (v as never) })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No profile</SelectItem>
                {WORKPLACE_PROFILES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Helps personalise responses. AccessAI still works perfectly without one.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Preferred language</Label>
            <Select value={prefs.language} onValueChange={(v) => update({ language: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
                <SelectItem value="__future" disabled>
                  More languages coming soon
                </SelectItem>
                {FUTURE_LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l} (preview)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reading level</Label>
            <Select
              value={prefs.readingLevel}
              onValueChange={(v) => update({ readingLevel: v as never })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {READING_LEVELS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Accessibility</Label>
            {[
              { key: "highContrast", label: "High contrast" },
              { key: "largerText", label: "Larger text" },
              { key: "readAloud", label: "Read responses aloud automatically" },
              { key: "simplify", label: "Simplify AI responses" },
            ].map((row) => (
              <label key={row.key} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={prefs[row.key as keyof typeof prefs] as boolean}
                  onCheckedChange={(c) =>
                    update({ [row.key]: Boolean(c) } as never)
                  }
                />
                <span className="text-sm">{row.label}</span>
              </label>
            ))}
          </div>

          <Separator />
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset to defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}