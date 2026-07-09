import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Languages, RefreshCw, Sparkles, Volume2, VolumeX, Wand2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences, speak, stopSpeaking } from "@/lib/preferences";
import { LANGUAGES, FUTURE_LANGUAGES } from "@/lib/constants";

type Props = {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  onReplace: (next: string) => void;
};

export function AiResponse({ content, loading, onRegenerate, onReplace }: Props) {
  const { prefs } = usePreferences();
  const [speaking, setSpeaking] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  async function run(task: "translate" | "explain" | "improve", meta?: Record<string, string>) {
    setBusy(task);
    try {
      const res = await generateAi({
        data: { task, input: content, prefs, meta },
      });
      onReplace(res.text);
      toast.success("Updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  function copy() {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  }

  function toggleSpeak() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(content);
      setSpeaking(true);
    }
  }

  if (loading) {
    return (
      <Card className="p-6 space-y-3 shadow-card">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (!content) return null;

  return (
    <Card className="p-6 space-y-4 shadow-card">
      <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button size="sm" variant="secondary" onClick={copy} className="gap-2">
          <Copy className="h-4 w-4" /> Copy
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="gap-2" disabled={busy === "translate"}>
              <Languages className="h-4 w-4" /> Translate
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <DropdownMenuItem key={l} onClick={() => run("translate", { targetLanguage: l })}>
                {l}
              </DropdownMenuItem>
            ))}
            {FUTURE_LANGUAGES.map((l) => (
              <DropdownMenuItem key={l} onClick={() => run("translate", { targetLanguage: l })}>
                {l}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="secondary" onClick={toggleSpeak} className="gap-2">
          {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {speaking ? "Stop" : "Read Aloud"}
        </Button>

        <Button size="sm" variant="secondary" onClick={() => run("explain")} disabled={busy === "explain"} className="gap-2">
          <BookOpen className="h-4 w-4" /> Explain Simply
        </Button>

        <Button size="sm" variant="secondary" onClick={() => run("improve")} disabled={busy === "improve"} className="gap-2">
          <Wand2 className="h-4 w-4" /> Improve Writing
        </Button>

        {onRegenerate && (
          <Button size="sm" variant="secondary" onClick={onRegenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground flex items-start gap-2 pt-2">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        AI-generated content may contain inaccuracies. Please review important information before
        using it professionally.
      </p>
    </Card>
  );
}