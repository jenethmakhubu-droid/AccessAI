import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SimplePromptFeature } from "@/components/SimplePromptFeature";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — AccessAI" }] }),
  component: () => (
    <SimplePromptFeature
      task="research"
      icon={Search}
      eyebrow="Feature 4"
      title="Research Assistant"
      description="Enter a topic. Ava returns a summary, key insights, important facts and recommendations."
      placeholder="e.g. Best practices for hybrid team communication"
      cta="Research topic"
      rows={4}
      activityLabel="Research analysed"
      suggestions={["Summarise findings","Explain simply","Create study notes"]}
    />
  ),
});