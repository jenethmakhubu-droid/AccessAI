import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type DragEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Accessibility,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Mic,
  MicOff,
  Paperclip,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateAi } from "@/lib/ai.functions";
import { usePreferences } from "@/lib/preferences";
import { useActivity } from "@/lib/activity";
import {
  ACCEPTED_DOC_EXT,
  ACCEPTED_IMAGE_EXT,
  TEXT_READABLE_EXT,
} from "@/lib/constants";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat with Ava — AccessAI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
type ChatAttachment = {
  name: string;
  mimeType: string;
  dataBase64: string;
  kind: "image" | "document";
  previewUrl?: string;
};

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}
function readAsText(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result ?? ""));
    r.onerror = () => rej(r.error);
    r.readAsText(file);
  });
}
function readAsDataUrl(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result ?? ""));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

function ChatPage() {
  const { prefs } = usePreferences();
  const { log } = useActivity();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Ava — your inclusive workplace assistant. Ask me anything about work: emails, meetings, planning, research, or just how to phrase something better.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [attachmentText, setAttachmentText] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleFile(file: File) {
    const ext = extOf(file.name);
    const isImage = (ACCEPTED_IMAGE_EXT as readonly string[]).includes(ext);
    const isDoc = (ACCEPTED_DOC_EXT as readonly string[]).includes(ext);
    if (!isImage && !isDoc) {
      toast.error("This file format isn't supported.");
      return;
    }
    try {
      if (isDoc && (TEXT_READABLE_EXT as readonly string[]).includes(ext)) {
        const text = await readAsText(file);
        setAttachmentText(text);
        setAttachment({
          name: file.name,
          mimeType: file.type || "text/plain",
          dataBase64: "",
          kind: "document",
        });
      } else {
        const dataUrl = await readAsDataUrl(file);
        const b64 = dataUrl.split(",")[1] ?? "";
        setAttachmentText("");
        setAttachment({
          name: file.name,
          mimeType:
            file.type ||
            (isImage ? "image/*" : ext === ".pdf" ? "application/pdf" : "application/octet-stream"),
          dataBase64: b64,
          kind: isImage ? "image" : "document",
          previewUrl: isImage ? dataUrl : undefined,
        });
      }
      toast.success("Attached — ask Ava anything about it.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't read this file.");
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function toggleMic() {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput((prev) => (prev ? prev + " " : "") + transcript.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  async function send() {
    const text = input.trim();
    if ((!text && !attachment) || loading) return;
    const history = messages;
    const userDisplay =
      text +
      (attachment ? `\n\n📎 ${attachment.name}` : "") ||
      (attachment ? `📎 ${attachment.name}` : "");
    setMessages([...history, { role: "user", content: userDisplay }]);
    setInput("");
    const sentAttachment = attachment;
    const sentAttachmentText = attachmentText;
    setAttachment(null);
    setAttachmentText("");
    setLoading(true);
    try {
      const promptText =
        (text || (sentAttachment ? `Please analyse the attached ${sentAttachment.kind}.` : "")) +
        (sentAttachmentText
          ? `\n\nAttached document content:\n${sentAttachmentText.slice(0, 20000)}`
          : "");
      const res = await generateAi({
        data: {
          task: "chat",
          input: promptText,
          prefs,
          history,
          attachment:
            sentAttachment && sentAttachment.dataBase64
              ? {
                  name: sentAttachment.name,
                  mimeType: sentAttachment.mimeType,
                  dataBase64: sentAttachment.dataBase64,
                  kind: sentAttachment.kind,
                }
              : undefined,
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
      log("chat", "Chat message");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Feature 5"
        title="Chat with Ava"
        description="A friendly, professional conversation with your workplace AI assistant."
      />
      <Card
        className={`shadow-card flex flex-col h-[calc(100dvh-16rem)] min-h-[500px] transition-colors ${
          dragOver ? "ring-2 ring-primary bg-primary/5" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gradient-hero text-primary-foreground"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Accessibility className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-hero grid place-items-center">
                <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                Ava is thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t p-3 sm:p-4">
          {attachment && (
            <div className="mb-2 flex items-center gap-3 rounded-lg border bg-muted/40 p-2">
              {attachment.previewUrl ? (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className="h-10 w-10 rounded object-cover border"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-primary/10 text-primary grid place-items-center">
                  {attachment.kind === "image" ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <FileTextIcon className="h-4 w-4" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{attachment.name}</div>
                <div className="text-xs text-muted-foreground">
                  {attachment.kind === "image" ? "Image" : "Document"} · ready
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAttachment(null);
                  setAttachmentText("");
                }}
                aria-label="Remove attachment"
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <input
              ref={fileRef}
              type="file"
              accept={[...ACCEPTED_DOC_EXT, ...ACCEPTED_IMAGE_EXT].join(",")}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach file or image"
              className="h-auto self-stretch px-3"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={listening ? "default" : "secondary"}
              size="lg"
              onClick={toggleMic}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              className="h-auto self-stretch px-3"
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask Ava anything — or attach a document or image..."
              rows={2}
              className="resize-none"
              aria-label="Message"
            />
            <Button
              onClick={send}
              disabled={loading || (!input.trim() && !attachment)}
              size="lg"
              aria-label="Send message"
              className="h-auto self-stretch px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Drag & drop a file anywhere in the chat · Voice input available · AI-generated content may contain inaccuracies.
          </p>
        </div>
      </Card>
    </AppLayout>
  );
}