The AccessAI foundation is already built (dashboard, email, meeting, planner, research, simplify, chat, preferences, inclusive AI actions, 13 languages). This plan closes the gaps between the current app and the re-pasted spec.

## Gaps to close

1. **Expanded languages** — `src/lib/constants.ts`
   Add Setswana, Sepedi, Xitsonga, Tshivenda, siSwati, isiNdebele, Japanese, Korean, Mandarin Chinese to the primary list so all SA official languages + spec languages are first-class (not "future").

2. **Landing page polish** — `src/routes/index.tsx`
   Ensure it matches spec: title, tagline, description, single prominent "Get Started" → `/dashboard`.

3. **Dashboard quick actions** — `src/routes/dashboard.tsx`
   Restructure hero to spec: greeting + "What would you like to accomplish today?" + **three large flagship cards** (Task Planner, Research Assistant, Ask Ava) with icons, descriptions, and Open buttons. Keep the "All features" grid below for Email / Meeting / Simplify.

4. **Task Planner upgrade** — new dedicated component replacing `SimplePromptFeature` usage in `src/routes/planner.tsx`
   - File upload (PDF / DOCX / TXT) with client-side text extraction (`pdfjs-dist`, `mammoth`, plain text)
   - Working hours inputs (start / end)
   - Planning style selector: Deep Focus / Balanced / Flexible
   - Update `ai.functions.ts` planner prompt to return structured sections including **Productivity Score**, **Workload level**, **AI Reflection**, Priority Matrix, Daily + Weekly Schedule, Time Optimization, Productivity Tips
   - Result view: existing AiResponse (Markdown) + a small stat header (Workload / Score) parsed from the response
   - Export button (download `.md`)

5. **Research Assistant upgrade** — `src/routes/research.tsx`
   - File upload (PDF / DOCX / TXT)
   - Disabled "Paste Website URL (coming soon)" input
   - Prompt returns: Executive Summary, Key Insights, Important Concepts, Recommendations, Action Items, Beginner Explanation, Questions You Might Ask Next, References note
   - Export button

6. **Ava Chat upgrade** — `src/routes/chat.tsx`
   - Suggested prompt chips (6 spec prompts) when conversation empty
   - System prompt asks Ava to end each response with: **Key Points**, **Recommended Next Steps**, **Related Questions**, **AI Confidence: High/Medium/Needs Verification**, **Next Best Actions**
   - Render as normal Markdown via AiResponse (already handles it)

7. **Shared export helper** — `src/lib/export.ts`
   Small `downloadMarkdown(filename, content)` utility used by planner/research.

## Non-goals
- Keep Email, Meeting, Simplify routes as-is (already implemented, not in current spec but useful).
- No auth, no backend changes beyond prompt edits.
- No new AI providers — continue using Lovable AI Gateway + `google/gemini-3-flash-preview`.

## Technical notes
- File parsing runs in the browser to keep server functions light: `pdfjs-dist` (already common), `mammoth` for DOCX, `FileReader` for TXT. Text is then sent as `input` to `generateAi`.
- Productivity Score / Workload parsed from Markdown via simple regex on known headings, with graceful fallback if missing.
- All new interactive controls keep keyboard focus rings and use existing shadcn primitives for accessibility.
