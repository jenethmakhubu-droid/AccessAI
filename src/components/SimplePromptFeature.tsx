import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "./AppLayout";
import { AiResponse } from "./AiResponse";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { SmartInput, type SmartInputValue } from "./SmartInput";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences } from "@/lib/preferences";
import { useActivity } from "@/lib/activity";

type Task = "meeting" | "planner" | "research" | "simplify";

export function SimplePromptFeature({
  task,
  icon,
  eyebrow,
  title,
  description,
  placeholder,
  cta,
  rows = 10,
  allowUploads = true,
  activityLabel,
  suggestions,
}: {
  task: Task;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  cta: string;
  rows?: number;
  allowUploads?: boolean;
  activityLabel: string;
  suggestions?: string[];
}) {
  const { prefs } = usePreferences();
  const { log } = useActivity();
  const [value, setValue] = useState<SmartInputValue>({ text: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!value.text.trim() && !value.attachment) {
      return toast.error("Add some text or upload a file first.");
    }
    setLoading(true);
    try {
      const res = await generateAi({
        data: {
          task,
          input: value.text.trim() || `Please analyse the attached ${value.attachment?.kind ?? "content"}.`,
          prefs,
          attachment: value.attachment
            ? {
                name: value.attachment.name,
                mimeType: value.attachment.mimeType,
                dataBase64: value.attachment.dataBase64,
                kind: value.attachment.kind,
              }
            : undefined,
        },
      });
      setOutput(res.text);
      log(task, activityLabel);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader icon={icon} eyebrow={eyebrow} title={title} description={description} />
      {allowUploads ? (
        <SmartInput
          value={value}
          onChange={setValue}
          textPlaceholder={placeholder}
          textRows={rows}
        />
      ) : (
        <SmartInput
          value={value}
          onChange={setValue}
          textPlaceholder={placeholder}
          textRows={rows}
          allowDocuments={false}
          allowImages={false}
        />
      )}

      {suggestions && (value.text || value.attachment) && !output && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground pt-1.5">✨ Smart suggestions:</span>
          {suggestions.map((s) => (
            <Button
              key={s}
              size="sm"
              variant="secondary"
              onClick={() => setValue((v) => ({ ...v, text: (v.text ? v.text + "\n\n" : "") + s }))}
            >
              ✨ {s}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button onClick={run} disabled={loading} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" /> {loading ? "Working…" : cta}
        </Button>
      </div>

      <div className="mt-6">
        <AiResponse content={output} loading={loading} onReplace={setOutput} onRegenerate={run} />
      </div>
    </AppLayout>
  );
}