import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { SimplePromptFeature } from "@/components/SimplePromptFeature";

export const Route = createFileRoute("/simplify")({
  head: () => ({ meta: [{ title: "Document Simplifier — AccessAI" }] }),
  component: () => (
    <SimplePromptFeature
      task="simplify"
      icon={FileText}
      eyebrow="Feature 6"
      title="Document Simplifier"
      description="Paste a long document. Ava returns a summary, a simplified version, a plain-language explanation and the key points."
      placeholder="Paste the document text here..."
      cta="Simplify document"
      rows={16}
    />
  ),
});