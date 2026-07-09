import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Download, Sparkles, TrendingUp, Gauge } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { AiResponse } from "@/components/AiResponse";
import { FileDropzone } from "@/components/FileDropzone";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateAi } from "@/lib/ai.functions";
import { downloadMarkdown } from "@/lib/export";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — AccessAI" }] }),
  component: PlannerPage,
});

const STYLES = ["Deep Focus", "Balanced", "Flexible"] as const;

function parseStats(md: string) {
  const workload = md.match(/\*\*Workload:\*\*\s*([A-Za-z]+)/)?.[1];
  const score = md.match(/\*\*Productivity Score:\*\*\s*(\d{1,3})/)?.[1];
  return { workload, score: score ? Number(score) : undefined };
}

function PlannerPage() {
  const { prefs } = usePreferences();
  const [tasks, setTasks] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("Balanced");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => (output ? parseStats(output) : null), [output]);

  async function run() {
    if (!tasks.trim()) return toast.error("Add tasks or upload a document first.");
    setLoading(true);
    try {
      const res = await generateAi({
        data: {
          task: "planner",
          input: tasks,
          prefs,
          meta: { workingHours: `${start} – ${end}`, planningStyle: style },
        },
      });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        icon={Calendar}
        eyebrow="Flagship feature"
        title="AI Task Planner"
        description="Type, paste or upload your tasks. Ava returns a priority matrix, time-blocked schedule, productivity score and reflection."
      />

      <Card className="p-6 shadow-card space-y-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Your tasks
          </Label>
          <Textarea
            rows={8}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={"One task per line, e.g.\n- Prepare Q3 forecast\n- Reply to client emails\n- Team stand-up at 10am"}
            className="resize-y"
          />
          <FileDropzone
            onParsed={(f) =>
              setTasks((prev) => (prev.trim() ? prev + "\n\n" : "") + f.text)
            }
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Start
            </Label>
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              End
            </Label>
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Planning style
            </Label>
            <Select value={style} onValueChange={(v) => setStyle(v as (typeof STYLES)[number])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={run} disabled={loading} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" /> {loading ? "Planning..." : "Plan my day"}
          </Button>
        </div>
      </Card>

      {stats && (stats.workload || stats.score !== undefined) && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {stats.workload && (
            <Card className="p-5 shadow-card flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Workload
                </div>
                <div className="font-serif text-2xl">{stats.workload}</div>
              </div>
            </Card>
          )}
          {stats.score !== undefined && (
            <Card className="p-5 shadow-card flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Productivity Score
                </div>
                <div className="font-serif text-2xl">{stats.score}%</div>
              </div>
            </Card>
          )}
        </div>
      )}

      <div className="mt-6">
        <AiResponse content={output} loading={loading} onReplace={setOutput} onRegenerate={run} />
        {output && (
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={() => downloadMarkdown("accessai-plan", output)}
            >
              <Download className="h-4 w-4" /> Export as Markdown
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}