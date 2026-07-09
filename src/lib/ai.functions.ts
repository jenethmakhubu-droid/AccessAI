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
        `The user will share today's tasks (typed, pasted, or extracted from a document). Working hours: ${meta?.workingHours ?? "9:00 – 17:00"}. Planning style: ${meta?.planningStyle ?? "Balanced"}.`,
        "Produce Markdown with these exact sections in this order:\n\n**Workload:** <Light | Medium | Heavy>\n**Productivity Score:** <0-100>%\n\n## Priority Matrix\nGroup tasks into: Urgent & Important, Important, Quick Wins, Later.\n\n## Daily Schedule\nA time-blocked schedule for today that respects working hours and planning style.\n\n## Weekly Schedule\nA short view spreading larger tasks across the week.\n\n## Estimated Duration\nPer-task duration estimates.\n\n## Time Optimization\nSuggestions to remove waste and batch similar work.\n\n## Productivity Tips\n3–5 concise, actionable tips.\n\n## AI Reflection\nA short paragraph reflecting on the plan's realism and suggesting one improvement.",
      );
      break;
    case "research":
      parts.push(
        "The user provides a research topic or a document to analyse. Produce Markdown with these exact sections:\n\n## Executive Summary\n## Key Insights\n## Important Concepts\n## Recommendations\n## Action Items\n## Beginner Explanation\nExplain the topic in plain language for someone new to it.\n\n## Questions You Might Ask Next\n5 short follow-up questions.\n\n## References\nNote which source material this is based on (the provided text/document). Mention that external web sources will be integrated in future versions.",
      );
      break;
    case "simplify":
      parts.push(
        "The user pastes a long document. Produce Markdown sections:\n## Summary\n## Simplified Version\n## Plain Language Explanation\n## Key Points",
      );
      break;
    case "chat":
      parts.push(
        "You are Ava — warm, professional, concise. Have a helpful workplace conversation.",
        "For substantive questions, format your reply as Markdown with these sections in this order:\n\n**Answer**\nA direct, useful answer.\n\n**Key Points**\n- 3 to 5 bullets.\n\n**Recommended Next Steps**\n- 2 to 4 concrete steps.\n\n**Related Questions**\n- 3 short follow-up questions.\n\n**AI Confidence:** <High | Medium | Needs Verification>\n\n**Next Best Actions:** Suggest 2–3 short actions like *Create a Task Plan*, *Summarize Further*, *Draft an Email*, or *Ask Another Question*.\n\nFor small talk or one-line acknowledgements, respond briefly in a single paragraph — skip the sections.",
      );
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