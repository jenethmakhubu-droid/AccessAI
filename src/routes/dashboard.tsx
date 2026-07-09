import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  FileText,
  Mail,
  MessagesSquare,
  NotebookPen,
  Search,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AccessAI" }] }),
  component: DashboardPage,
});

const FLAGSHIP = [
  {
    icon: Calendar,
    emoji: "📅",
    title: "AI Task Planner",
    desc: "Turn your to-dos into a prioritised, time-blocked schedule with a productivity score.",
    to: "/planner",
  },
  {
    icon: Search,
    emoji: "📚",
    title: "Research Assistant",
    desc: "Summarise documents into insights, action items and a beginner-friendly explanation.",
    to: "/research",
  },
  {
    icon: MessagesSquare,
    emoji: "🤖",
    title: "Ask Ava",
    desc: "Chat with Ava, your inclusive workplace AI, for answers, drafts and next best actions.",
    to: "/chat",
  },
] as const;

const FEATURES = [
  { icon: Mail, title: "Email Assistant", desc: "Audience, tone, purpose — get subject, body and closing.", to: "/email" },
  { icon: NotebookPen, title: "Meeting Assistant", desc: "Summaries, decisions, action items, deadlines.", to: "/meeting" },
  { icon: FileText, title: "Document Simplifier", desc: "Plain-language rewrite of long documents.", to: "/simplify" },
];

function DashboardPage() {
  const { prefs } = usePreferences();
  return (
    <AppLayout>
      <section className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
          👋 Welcome
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight">
          Hi, I'm Ava — your inclusive workplace AI assistant.
        </h1>
        <p className="text-muted-foreground text-lg">What would you like to accomplish today?</p>
        {prefs.workplaceProfile && (
          <div className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary rounded-full px-3 py-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Personalising for {prefs.workplaceProfile}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Flagship tools
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {FLAGSHIP.map((f) => (
            <Card
              key={f.title}
              className="p-6 shadow-card hover:shadow-elevated transition-all flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-hero text-primary-foreground grid place-items-center text-2xl shadow-elevated">
                  {f.emoji}
                </div>
                <h3 className="font-serif text-xl leading-tight">{f.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
              <Link to={f.to}>
                <Button className="w-full gap-2">
                  Open <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          More tools
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to}>
              <Card className="p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer h-full flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-serif text-lg leading-tight">{f.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}