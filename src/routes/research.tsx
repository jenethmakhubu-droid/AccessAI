import { createFileRoute } from "@tanstack/react-router";
import { Download, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { AiResponse } from "@/components/AiResponse";
import { FileDropzone } from "@/components/FileDropzone";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAi } from "@/lib/ai.functions";
import { downloadMarkdown } from "@/lib/export";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — AccessAI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const { prefs } = usePreferences();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) return toast.error("Add a topic, paste text, or upload a document.");
    setLoading(true);
    try {
      const res = await generateAi({ data: { task: "research", input, prefs } });
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
        icon={Search}
        eyebrow="Flagship feature"
        title="Research Assistant"
        description="Enter a topic, paste text, or upload a document. Ava returns an executive summary, key insights, recommendations and beginner-friendly explanation."
      />

      <Card className="p-6 shadow-card space-y-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Topic or document text
          </Label>
          <Textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text, or type a research question like 'Best practices for hybrid team communication'..."
            className="resize-y"
          />
          <FileDropzone
            onParsed={(f) =>
              setInput((prev) => (prev.trim() ? prev + "\n\n" : "") + f.text)
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Website URL (coming soon)
          </Label>
          <Input
            disabled
            placeholder="https://example.com — external web sources are planned for a future release"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={run} disabled={loading} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" /> {loading ? "Researching..." : "Research topic"}
          </Button>
        </div>
      </Card>

      <div className="mt-6">
        <AiResponse content={output} loading={loading} onReplace={setOutput} onRegenerate={run} />
        {output && (
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={() => downloadMarkdown("accessai-research", output)}
            >
              <Download className="h-4 w-4" /> Export as Markdown
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}