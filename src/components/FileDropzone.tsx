import { useRef, useState } from "react";
import { FileUp, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { parseFile, type ParsedFile } from "@/lib/file-parse";

type Props = {
  onParsed: (file: ParsedFile) => void;
  label?: string;
  accept?: string;
};

export function FileDropzone({
  onParsed,
  label = "Upload PDF, DOCX or TXT",
  accept = ".pdf,.docx,.txt,application/pdf,text/plain",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const parsed = await parseFile(file);
      setFileName(parsed.name);
      onParsed(parsed);
      toast.success(`Loaded ${parsed.name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="gap-2"
      >
        <FileUp className="h-4 w-4" />
        {loading ? "Reading..." : label}
      </Button>
      {fileName && (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1.5">
          {fileName}
          <button
            type="button"
            onClick={() => setFileName(null)}
            aria-label="Clear file"
            className="hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
}