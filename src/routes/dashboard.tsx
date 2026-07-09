import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  FileText,
  Globe2,
  Lightbulb,
  Mail,
  MessagesSquare,
  NotebookPen,
  Search,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AccessAI" }] }),
  component: DashboardPage,
});

const QUICK = [
  { icon: Mail, label: "Draft an Email", to: "/email", emoji: "✉️" },
  { icon: FileText, label: "Summarize a Document", to: "/simplify", emoji: "📄" },
  { icon: Calendar, label: "Plan My Day", to: "/planner", emoji: "📅" },
  { icon: Globe2, label: "Translate Text", to: "/chat", emoji: "🌍" },
  { icon: Lightbulb, label: "Explain Something", to: "/research", emoji: "💡" },
  { icon: MessagesSquare, label: "Ask Ava", to: "/chat", emoji: "🤖" },
] as const;

const FEATURES = [
  { icon: Mail, title: "Email Assistant", desc: "Audience, tone, purpose — get subject, body and closing.", to: "/email" },
  { icon: NotebookPen, title: "Meeting Assistant", desc: "Summaries, decisions, action items, deadlines.", to: "/meeting" },
  { icon: Calendar, title: "Task Planner", desc: "Priority order, schedule and productivity tips.", to: "/planner" },
  { icon: Search, title: "Research Assistant", desc: "Summary, key insights, facts and recommendations.", to: "/research" },
  { icon: FileText, title: "Document Simplifier", desc: "Plain-language rewrite of long documents.", to: "/simplify" },
  { icon: MessagesSquare, title: "Ava AI Chat", desc: "Conversational workplace assistant.", to: "/chat" },
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
          Quick actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK.map((q) => (
            <Link key={q.label} to={q.to}>
              <Card className="p-4 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                <div className="text-2xl mb-2">{q.emoji}</div>
                <div className="font-medium text-sm leading-snug">{q.label}</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          All features
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