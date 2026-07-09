import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, Globe2, Heart, Shield, Sparkles, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AccessAI — Inclusive workplace AI" },
      {
        name: "description",
        content:
          "AccessAI was created with the belief that productivity tools should adapt to people — not the other way around.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Accessibility, title: "Accessible by design", desc: "Keyboard, contrast, larger text, read aloud — never bolt-ons." },
  { icon: Globe2, title: "Multilingual", desc: "English, isiZulu, Afrikaans, Sesotho, isiXhosa. More coming." },
  { icon: Users, title: "Industry aware", desc: "Optional workplace profiles that shape every response." },
  { icon: Shield, title: "Responsible AI", desc: "Every response labelled with clear guidance to review." },
];

function About() {
  return (
    <AppLayout>
      <PageHeader
        icon={Heart}
        eyebrow="About AccessAI"
        title="Making workplace AI accessible to everyone."
      />

      <Card className="p-8 shadow-card mb-8 bg-gradient-hero text-primary-foreground">
        <p className="text-lg leading-relaxed font-serif">
          AccessAI was created with the belief that productivity tools should adapt to people —
          not the other way around.
        </p>
        <p className="mt-4 leading-relaxed opacity-90">
          By combining AI-powered workplace assistance with accessibility and inclusive design,
          AccessAI helps professionals of different abilities, languages, communication
          preferences and industries work more efficiently and confidently.
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {VALUES.map((v) => (
          <Card key={v.title} className="p-5 shadow-card flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
              <v.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-lg leading-tight">{v.title}</div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <h2 className="font-serif text-2xl mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          AccessAI empowers professionals to work smarter by combining AI-powered productivity
          with accessibility, multilingual communication, and inclusive design — ensuring
          workplace technology adapts to people, not the other way around.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button size="lg">Open the assistant</Button>
          </Link>
        </div>
      </Card>
    </AppLayout>
  );
}