import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Accessibility, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat with Ava — AccessAI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Help me plan my day",
  "Summarize this report",
  "Explain this concept",
  "Draft a professional email",
  "Improve my writing",
  "Translate this text",
];

function ChatPage() {
  const { prefs } = usePreferences();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Ava — your inclusive workplace assistant. Ask me anything about work: emails, meetings, planning, research, or just how to phrase something better.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages;
    setMessages([...history, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await generateAi({
        data: { task: "chat", input: text, prefs, history },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function sendSuggested(text: string) {
    if (loading) return;
    const history = messages;
    setMessages([...history, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await generateAi({
        data: { task: "chat", input: text, prefs, history },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Feature 5"
        title="Chat with Ava"
        description="A friendly, professional conversation with your workplace AI assistant."
      />
      <Card className="shadow-card flex flex-col h-[calc(100dvh-16rem)] min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gradient-hero text-primary-foreground"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Accessibility className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-hero grid place-items-center">
                <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                Ava is thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {messages.length <= 1 && !loading && (
          <div className="px-4 sm:px-6 pb-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendSuggested(s)}
                  className="text-xs rounded-full border bg-background hover:bg-muted px-3 py-1.5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="border-t p-3 sm:p-4">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask Ava anything about your workplace..."
              rows={2}
              className="resize-none"
              aria-label="Message"
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="lg" aria-label="Send message" className="h-auto self-stretch px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            AI-generated content may contain inaccuracies. Please review important information before using it professionally.
          </p>
        </div>
      </Card>
    </AppLayout>
  );
}