import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { SimplePromptFeature } from "@/components/SimplePromptFeature";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — AccessAI" }] }),
  component: () => (
    <SimplePromptFeature
      task="planner"
      icon={Calendar}
      eyebrow="Feature 3"
      title="Task Planner"
      description="List today's tasks. Ava suggests priority order, a schedule, estimated durations and productivity tips."
      placeholder={"One task per line, e.g.\n- Prepare Q3 forecast\n- Reply to client emails\n- Team stand-up at 10am"}
      cta="Plan my day"
      rows={10}
    />
  ),
});