// Client-side file text extraction for TXT / DOCX / PDF.
// All heavy libs are dynamically imported so they only load when needed.

export type ParsedFile = { name: string; text: string };

const MAX_CHARS = 60_000;

function clamp(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS) + "\n\n[…document truncated for length…]";
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const name = file.name;
  const lower = name.toLowerCase();

  if (lower.endsWith(".txt") || file.type.startsWith("text/")) {
    const text = await file.text();
    return { name, text: clamp(text) };
  }

  if (lower.endsWith(".docx")) {
    // @ts-expect-error - no types for browser build
    const mammoth = await import("mammoth/mammoth.browser.js");
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return { name, text: clamp(value) };
  }

  if (lower.endsWith(".pdf") || file.type === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    // Use the bundled worker via URL so it works in Vite.
    const workerMod: { default: string } = await import(
      // @ts-expect-error - Vite worker URL import
      "pdfjs-dist/build/pdf.worker.min.mjs?url"
    );
    pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((it) => ("str" in it ? (it as { str: string }).str : ""))
        .join(" ");
      text += pageText + "\n\n";
      if (text.length > MAX_CHARS) break;
    }
    return { name, text: clamp(text.trim()) };
  }

  throw new Error(`Unsupported file type: ${name}. Use TXT, DOCX or PDF.`);
}