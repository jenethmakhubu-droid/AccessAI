import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AudienceCombobox({
  value,
  onChange,
  options,
  placeholder = "Select or type your audience...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const hasExact = options.some((o) => o.toLowerCase() === trimmed.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width] min-w-[240px]"
        align="start"
      >
        <Command
          filter={(v, s) => (v.toLowerCase().includes(s.toLowerCase()) ? 1 : 0)}
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed && !hasExact) {
                e.preventDefault();
                onChange(trimmed);
                setOpen(false);
                setQuery("");
              }
            }}
          />
          <CommandList>
            {trimmed && !hasExact && (
              <CommandGroup heading="Custom">
                <CommandItem
                  value={`__use__${trimmed}`}
                  onSelect={() => {
                    onChange(trimmed);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  Use "{trimmed}"
                </CommandItem>
              </CommandGroup>
            )}
            <CommandEmpty>Type to add a custom audience.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {options.map((o) => (
                <CommandItem
                  key={o}
                  value={o}
                  onSelect={() => {
                    onChange(o);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === o ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}