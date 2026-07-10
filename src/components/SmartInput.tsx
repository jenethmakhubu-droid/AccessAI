import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  Replace,
  Eye,
  Sparkles,
  FileUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ACCEPTED_DOC_EXT,
  ACCEPTED_IMAGE_EXT,
  TEXT_READABLE_EXT,
} from "@/lib/constants";

export type Attachment = {
  name: string;
  mimeType: string;
  dataBase64: string;
  kind: "image" | "document";
  previewUrl?: string;
};

export type SmartInputValue = {
  text: string;
  attachment?: Attachment;
};

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function readAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type Mode = "text" | "document" | "image";

export function SmartInput({
  value,
  onChange,
  textPlaceholder,
  textRows = 10,
  allowImages = true,
  allowDocuments = true,
  examples,
}: {
  value: SmartInputValue;
  onChange: (v: SmartInputValue) => void;
  textPlaceholder: string;
  textRows?: number;
  allowImages?: boolean;
  allowDocuments?: boolean;
  examples?: { label: string; emoji: string; sample: string }[];
}) {
  const [mode, setMode] = useState<Mode>("text");
  const [processing, setProcessing] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File, kind: "image" | "document") => {
      const ext = extOf(file.name);
      const allowed =
        kind === "image"
          ? (ACCEPTED_IMAGE_EXT as readonly string[]).includes(ext)
          : (ACCEPTED_DOC_EXT as readonly string[]).includes(ext);
      if (!allowed) {
        toast.error("This file format isn't currently supported.");
        return;
      }
      setProcessing(kind === "image" ? "Understanding your image…" : "Reading your document…");
      setProgress(15);
      try {
        if (kind === "document" && (TEXT_READABLE_EXT as readonly string[]).includes(ext)) {
          const text = await readAsText(file);
          setProgress(90);
          onChange({
            text,
            attachment: {
              name: file.name,
              mimeType: file.type || "text/plain",
              dataBase64: "",
              kind: "document",
            },
          });
        } else {
          const dataUrl = await readAsDataUrl(file);
          const b64 = dataUrl.split(",")[1] ?? "";
          setProgress(80);
          const mimeType =
            file.type ||
            (kind === "image" ? "image/*" : ext === ".pdf" ? "application/pdf" : "application/octet-stream");
          onChange({
            text: value.text,
            attachment: {
              name: file.name,
              mimeType,
              dataBase64: b64,
              kind,
              previewUrl: kind === "image" ? dataUrl : undefined,
            },
          });
        }
        setProgress(100);
        toast.success("Ready — Ava is preparing your analysis.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "We couldn't read this file.");
      } finally {
        setTimeout(() => {
          setProcessing(null);
          setProgress(0);
        }, 300);
      }
    },
    [onChange, value.text],
  );

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f, mode === "image" ? "image" : "document");
  }

  function clearAttachment() {
    onChange({ text: value.text, attachment: undefined });
  }

  const acceptAttr =
    mode === "image"
      ? ACCEPTED_IMAGE_EXT.join(",")
      : ACCEPTED_DOC_EXT.join(",");

  return (
    <Card className="p-4 sm:p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Choose how you'd like to work today
        </div>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="text" className="gap-2">
            <FileText className="h-4 w-4" /> <span className="hidden sm:inline">Paste Text</span><span className="sm:hidden">Text</span>
          </TabsTrigger>
          <TabsTrigger value="document" className="gap-2" disabled={!allowDocuments}>
            <FileUp className="h-4 w-4" /> <span className="hidden sm:inline">Upload Document</span><span className="sm:hidden">Doc</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2" disabled={!allowImages}>
            <ImageIcon className="h-4 w-4" /> <span className="hidden sm:inline">Upload Image</span><span className="sm:hidden">Image</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4">
          <Textarea
            rows={textRows}
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            placeholder={textPlaceholder}
            className="resize-y"
            aria-label="Input text"
          />
          {examples && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground pt-1">Try an example:</span>
              {examples.map((ex) => (
                <Button
                  key={ex.label}
                  size="sm"
                  variant="secondary"
                  onClick={() => onChange({ text: ex.sample, attachment: undefined })}
                >
                  <span aria-hidden>{ex.emoji}</span> {ex.label}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="document" className="mt-4">
          <UploadZone
            kind="document"
            accept={acceptAttr}
            dragOver={dragOver}
            onDragEnter={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            inputRef={inputRef}
            onPick={(f) => handleFile(f, "document")}
            processing={processing}
            progress={progress}
            attachment={value.attachment}
            onClear={clearAttachment}
          />
        </TabsContent>

        <TabsContent value="image" className="mt-4">
          <UploadZone
            kind="image"
            accept={acceptAttr}
            dragOver={dragOver}
            onDragEnter={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            inputRef={inputRef}
            onPick={(f) => handleFile(f, "image")}
            processing={processing}
            progress={progress}
            attachment={value.attachment}
            onClear={clearAttachment}
          />
        </TabsContent>
      </Tabs>

      {!value.text && !value.attachment && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Upload a document or image to begin — or paste your text above.
        </div>
      )}
    </Card>
  );
}

function UploadZone({
  kind,
  accept,
  dragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  inputRef,
  onPick,
  processing,
  progress,
  attachment,
  onClear,
}: {
  kind: "image" | "document";
  accept: string;
  dragOver: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (f: File) => void;
  processing: string | null;
  progress: number;
  attachment?: Attachment;
  onClear: () => void;
}) {
  if (attachment) {
    return (
      <div className="rounded-xl border bg-card p-4 flex items-start gap-4">
        {attachment.previewUrl ? (
          <img
            src={attachment.previewUrl}
            alt={attachment.name}
            className="h-20 w-20 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-primary/10 grid place-items-center text-primary">
            <FileText className="h-8 w-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate" title={attachment.name}>{attachment.name}</div>
          <div className="text-xs text-muted-foreground">
            {attachment.mimeType || (kind === "image" ? "image" : "document")} · ready
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()} className="gap-1">
              <Replace className="h-3.5 w-3.5" /> Replace
            </Button>
            {attachment.previewUrl && (
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="gap-1"
              >
                <a href={attachment.previewUrl} target="_blank" rel="noreferrer">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </a>
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onClear} className="gap-1 text-destructive hover:text-destructive">
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/30"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragEnter();
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onClick={() => inputRef.current?.click()}
      aria-label={kind === "image" ? "Upload an image" : "Upload a document"}
    >
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center mb-3">
        {kind === "image" ? <ImageIcon className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
      </div>
      <div className="font-medium">
        {kind === "image" ? "🖼 Drag & drop your image here" : "📄 Drag & drop your file here"}
      </div>
      <div className="text-sm text-muted-foreground mt-1">or browse your device</div>
      <div className="text-xs text-muted-foreground mt-3">
        {kind === "image"
          ? "PNG · JPG · WEBP · GIF · BMP · TIFF"
          : "PDF · DOC · DOCX · TXT · RTF · MD · XLS · XLSX · CSV · PPT · PPTX"}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {processing && (
        <div className="absolute inset-0 rounded-xl bg-background/85 backdrop-blur-sm grid place-items-center">
          <div className="text-center space-y-3 px-6">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <div className="font-medium">{processing}</div>
            <div className="h-1.5 w-56 mx-auto rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-hero transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}