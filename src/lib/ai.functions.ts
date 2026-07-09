import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const PrefsSchema = z.object({
  language: z.string().default("English"),
  readingLevel: z.enum(["Standard", "Simple English", "Beginner"]).default("Standard"),
  simplify: z.boolean().default(false),
  workplaceProfile: z.string().optional(),
});

const InputSchema = z.object({
  task: z.enum([
    "email",
    "meeting",
    "planner",
    "research",
    "simplify",
    "chat",
    "translate",
    "explain",
    "improve",
  ]),
  input: z.string().min(1),
  meta: z.record(z.string(), z.string()).optional(),
  prefs: PrefsSchema.default({
    language: "English",
    readingLevel: "Standard",
    simplify: false,
  }),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

function buildSystemPrompt(
  task: string,
  prefs: z.infer<typeof PrefsSchema>,
  meta?: Record<string, string>,
) {
  const parts: string[] = [
    "You are Ava, an inclusive workplace productivity assistant from AccessAI.",
    "You produce clear, professional, and accessible outputs.",
  ];
  if (prefs.workplaceProfile) {
    parts.push(`The user works in the ${prefs.workplaceProfile} industry — tailor examples and terminology accordingly.`);
  }
  if (prefs.readingLevel === "Simple English") {
    parts.push("Use simple English: short sentences, common words, no jargon.");
  } else if (prefs.readingLevel === "Beginner") {
    parts.push("Use beginner-friendly language: very short sentences, define any technical term inline.");
  }
  if (prefs.simplify) {
    parts.push("Always simplify explanations and remove unnecessary complexity.");
  }
  if (prefs.language && prefs.language !== "English") {
    parts.push(`Respond in ${prefs.language}.`);
  }

  switch (task) {
    case "email":
      parts.push(
        `Write a complete workplace email. Audience: ${meta?.audience ?? "Colleague"}. Tone: ${meta?.tone ?? "Professional"}. Purpose: ${meta?.purpose ?? "General"}.`,
        "Format your response as Markdown with these exact headings:\n**Subject:** <one line>\n\n**Email:**\n<body paragraphs>\n\n**Closing:** <sign-off line>",
      );
      break;
    case "meeting":
      parts.push(
        "The user will paste meeting notes. Produce Markdown sections:\n## Summary\n## Key Decisions\n## Action Items\n## Deadlines\n## Responsibilities\nUse bullet lists where appropriate.",
      );
      break;
    case "planner":
      parts.push(
        "The user lists today's tasks. Produce Markdown sections:\n## Priority Order (numbered)\n## Suggested Schedule (with time blocks)\n## Estimated Duration (per task)\n## Productivity Tips (3-5 tips)",
      );
      break;
    case "research":
      parts.push(
        "The user gives a research topic. Produce Markdown sections:\n## Summary\n## Key Insights\n## Important Facts\n## Recommendations",
      );
      break;
    case "simplify":
      parts.push(
        "The user pastes a long document. Produce Markdown sections:\n## Summary\n## Simplified Version\n## Plain Language Explanation\n## Key Points",
      );
      break;
    case "chat":
      parts.push("Have a friendly, helpful workplace conversation. Be concise but thorough.");
      break;
    case "translate":
      parts.push(
        `Translate the user's text into ${meta?.targetLanguage ?? prefs.language}. Preserve tone and formatting. Return only the translation.`,
      );
      break;
    case "explain":
      parts.push("Re-explain the following text in very simple, plain language a beginner can understand. Use short sentences.");
      break;
    case "improve":
      parts.push("Improve the writing of the following text: clearer wording, better flow, fix grammar. Keep the original meaning. Return only the improved text.");
      break;
  }
  return parts.join("\n\n");
}

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");
    const system = buildSystemPrompt(data.task, data.prefs, data.meta);

    const messages =
      data.history && data.history.length > 0
        ? [
            ...data.history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user" as const, content: data.input },
          ]
        : [{ role: "user" as const, content: data.input }];

    const { text } = await generateText({
      model,
      system,
      messages,
    });
    return { text };
  });