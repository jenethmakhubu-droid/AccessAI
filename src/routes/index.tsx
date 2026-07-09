import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowRight,
  Calendar,
  FileText,
  Globe2,
  Mail,
  MessagesSquare,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Landing,
});

const HIGHLIGHTS = [
  { icon: Mail, title: "Email Assistant", desc: "Draft polished, on-tone emails in seconds." },
  { icon: NotebookPen, title: "Meeting Notes", desc: "Turn raw notes into summaries and action items." },
  { icon: Calendar, title: "Task Planner", desc: "Prioritise your day with a suggested schedule." },
  { icon: Search, title: "Research", desc: "Get summaries, insights and recommendations fast." },
  { icon: FileText, title: "Document Simplifier", desc: "Rewrite long docs in plain language." },
  { icon: MessagesSquare, title: "Ava AI Chat", desc: "A friendly workplace assistant on call." },
];

const INCLUSIVE = [
  { title: "Accessible by default", desc: "Keyboard nav, high contrast, larger text, read aloud — built in." },
  { title: "Multilingual", desc: "English, isiZulu, Afrikaans, Sesotho, isiXhosa. More coming." },
  { title: "Adjustable reading level", desc: "Standard, Simple English or Beginner — you choose." },
  { title: "Industry aware", desc: "Optional workplace profile tailors every response." },
];

function Landing() {
  return (
    <div className="min-h-dvh bg-gradient-soft">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-elevated">
            <Accessibility className="h-5 w-5 text-primary-foreground" strokeWidth={2.25} />
          </div>
          <span className="font-serif text-xl">AccessAI</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gap-1.5">
              Open app <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Inclusive workplace productivity
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif leading-[1.05] tracking-tight">
          Making workplace AI <em className="text-primary not-italic">accessible</em> to everyone.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AccessAI is an AI-powered workplace assistant that helps professionals save time,
          communicate effectively and work more efficiently through inclusive and accessible AI
          tools.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-elevated">
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="ghost" className="h-12 px-6 text-base">
              Learn more
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground pt-4 flex items-center justify-center gap-2">
          <Globe2 className="h-3.5 w-3.5" /> No sign-up. No account. Just open and start working.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif">Six tools for real workplace tasks</h2>
          <p className="text-muted-foreground mt-3">Everyday productivity, reimagined for everyone.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="p-6 shadow-card hover:shadow-elevated transition group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl mb-1.5">{h.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-10 sm:p-14 shadow-elevated">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Built with accessibility, not around it.</h2>
            <p className="opacity-90 leading-relaxed">
              Every response comes with translate, read-aloud, plain-language, copy, regenerate and improve —
              consistently, everywhere. Because productivity tools should adapt to people.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {INCLUSIVE.map((i) => (
              <div key={i.title}>
                <div className="font-serif text-lg mb-1">{i.title}</div>
                <p className="text-sm opacity-80 leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-background/60 py-8 px-6 text-center text-xs text-muted-foreground">
        <div className="font-serif text-base text-foreground">AccessAI</div>
        <div>Making workplace AI accessible to everyone.</div>
        <div className="mt-1">Designed to make workplace AI more inclusive, productive and accessible.</div>
      </footer>
    </div>
  );
}
