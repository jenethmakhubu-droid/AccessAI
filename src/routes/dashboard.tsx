import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Mail,
  MessagesSquare,
  NotebookPen,
  Search,
  Sparkles,
  BarChart3,
  Globe2,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/lib/preferences";
import { useActivity } from "@/lib/activity";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AccessAI" }] }),
  component: DashboardPage,
});

const QUICK = [
  { label: "Draft an Email", to: "/email", emoji: "✉️" },
  { label: "Summarize a Document", to: "/simplify", emoji: "📄" },
  { label: "Analyse a Report", to: "/research", emoji: "📊" },
  { label: "Explain an Image", to: "/chat", emoji: "🖼" },
  { label: "Plan My Day", to: "/planner", emoji: "📅" },
  { label: "Translate Text", to: "/chat", emoji: "🌍" },
  { label: "Explain Something", to: "/research", emoji: "💡" },
  { label: "Chat with Ava", to: "/chat", emoji: "🤖" },
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
  const { activities, clear } = useActivity();
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Recent activity
          </h2>
          {activities.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-xs">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
        {activities.length === 0 ? (
          <Card className="p-6 text-center shadow-card border-dashed">
            <Sparkles className="h-6 w-6 mx-auto text-primary mb-2" />
            <div className="font-medium">You're ready to get started.</div>
            <p className="text-sm text-muted-foreground mt-1">
              Choose one of the actions above or upload a document.
            </p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {activities.slice(0, 6).map((a) => (
              <Card key={a.id} className="p-4 shadow-card flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  {iconFor(a.type)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{a.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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

function iconFor(type: string) {
  const cls = "h-4 w-4";
  switch (type) {
    case "email": return <Mail className={cls} />;
    case "meeting": return <NotebookPen className={cls} />;
    case "planner": return <Calendar className={cls} />;
    case "research": return <BarChart3 className={cls} />;
    case "simplify": return <FileText className={cls} />;
    case "chat": return <MessagesSquare className={cls} />;
    default: return <Sparkles className={cls} />;
  }
}