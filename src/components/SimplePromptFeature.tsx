import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "./AppLayout";
import { AiResponse } from "./AiResponse";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences } from "@/lib/preferences";

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
}: {
  task: Task;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  cta: string;
  rows?: number;
}) {
  const { prefs } = usePreferences();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) return toast.error("Add some text first.");
    setLoading(true);
    try {
      const res = await generateAi({ data: { task, input, prefs } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader icon={icon} eyebrow={eyebrow} title={title} description={description} />
      <Card className="p-6 shadow-card space-y-4">
        <Textarea
          rows={rows}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="resize-y"
        />
        <div className="flex justify-end">
          <Button onClick={run} disabled={loading} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" /> {loading ? "Working..." : cta}
          </Button>
        </div>
      </Card>
      <div className="mt-6">
        <AiResponse content={output} loading={loading} onReplace={setOutput} onRegenerate={run} />
      </div>
    </AppLayout>
  );
}