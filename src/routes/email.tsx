import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { AiResponse } from "@/components/AiResponse";
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
import { EMAIL_AUDIENCES, EMAIL_TONES, LANGUAGES } from "@/lib/constants";
import { AudienceCombobox } from "@/components/AudienceCombobox";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Assistant — AccessAI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const { prefs } = usePreferences();
  const [audience, setAudience] = useState("Colleague");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState(prefs.language);
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!purpose.trim()) return toast.error("Add an email purpose to get started.");
    setLoading(true);
    try {
      const res = await generateAi({
        data: {
          task: "email",
          input: context || "(no extra context)",
          meta: { audience, tone, purpose },
          prefs: { ...prefs, language },
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
        icon={Mail}
        eyebrow="Feature 1"
        title="Email Assistant"
        description="Set your audience, tone and language. Ava drafts a subject line, professional body and closing you can copy in one click."
      />

      <Card className="p-6 shadow-card space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Audience">
            <AudienceCombobox
              value={audience}
              onChange={setAudience}
              options={EMAIL_AUDIENCES}
            />
          </Field>
          <Field label="Tone">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EMAIL_TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Email purpose">
          <Input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Follow up on the Q3 budget review"
          />
        </Field>
        <Field label="Additional context (optional)">
          <Textarea
            rows={5}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Key points, recipient name, dates, decisions to include..."
          />
        </Field>
        <div className="flex justify-end">
          <Button onClick={generate} disabled={loading} size="lg" className="gap-2">
            <Send className="h-4 w-4" /> {loading ? "Drafting..." : "Generate email"}
          </Button>
        </div>
      </Card>

      <div className="mt-6">
        <AiResponse
          content={output}
          loading={loading}
          onReplace={setOutput}
          onRegenerate={generate}
        />
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}