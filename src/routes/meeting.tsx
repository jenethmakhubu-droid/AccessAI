import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { SimplePromptFeature } from "@/components/SimplePromptFeature";

export const Route = createFileRoute("/meeting")({
  head: () => ({ meta: [{ title: "Meeting Assistant — AccessAI" }] }),
  component: () => (
    <SimplePromptFeature
      task="meeting"
      icon={NotebookPen}
      eyebrow="Feature 2"
      title="Meeting Assistant"
      description="Paste your raw meeting notes. Ava returns a summary, key decisions, action items, deadlines and responsibilities."
      placeholder="Paste meeting notes here..."
      cta="Summarise meeting"
      rows={14}
      activityLabel="Meeting summarised"
      suggestions={["Generate follow-up email","Extract action items","Create task list"]}
    />
  ),
});