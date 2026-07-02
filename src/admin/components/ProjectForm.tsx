import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TECH_OPTIONS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "GraphQL",
  "Figma",
  "Docker",
];

const OTHER_OPTION_VALUE = "__other__";

export type ProjectFormValues = {
  title: string;
  description: string;
  tech: string;
  url: string;
};

export type ProjectFormProps = {
  initialValues?: ProjectFormValues;
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel?: () => void;
};

function parseTechList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProjectForm({ initialValues, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [tech, setTech] = useState(initialValues?.tech ?? "");
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const techInputRef = useRef<HTMLInputElement>(null);

  const selectedTech = useMemo(() => parseTechList(tech), [tech]);

  const handleTechSelect = (value: string) => {
    if (!value) return;
    if (value === OTHER_OPTION_VALUE) {
      techInputRef.current?.focus();
    } else {
      setTech((prev) => {
        const current = parseTechList(prev);
        const exists = current.some((item) => item.toLowerCase() === value.toLowerCase());
        if (exists) return prev;
        return [...current, value].join(", ");
      });
    }
  };

  const handleRemoveTech = (item: string) => {
    setTech((prev) => {
      const filtered = parseTechList(prev).filter((techItem) => techItem.toLowerCase() !== item.toLowerCase());
      return filtered.join(", ");
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTech = parseTechList(tech).join(", ");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tech: normalizedTech,
      url: url.trim(),
    });
  };

  return (
<form className="grid gap-4" onSubmit={handleSubmit}>
  <div className="grid gap-2">
    <Label htmlFor="title">Title</Label>
    <Input
      id="title"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      placeholder="e.g. Portfolio Redesign"
      required
    />
  </div>

  <div className="grid gap-2">
    <Label htmlFor="url">Website URL</Label>
    <Input
      id="url"
      type="url"
      value={url}
      onChange={(event) => setUrl(event.target.value)}
      placeholder="https://example.com"
      required
    />
  </div>

  <div className="grid gap-2">
    <Label htmlFor="description">Description</Label>
    <Textarea
      id="description"
      value={description}
      onChange={(event) => setDescription(event.target.value)}
      placeholder="Provide a short summary of the project goals"
      required
    />
  </div>

  <div className="grid gap-2">
    <Label htmlFor="tech">Tech (comma separated)</Label>

    <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
      <div className="grid gap-1">
        <Label
          htmlFor="tech-presets"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          Choose from presets
        </Label>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              id="tech-presets"
              className="flex h-11 w-full items-center justify-between rounded-xl border border-border/60 bg-background px-3 text-sm font-medium text-foreground shadow-sm transition hover:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
            >
              <span>Select a technology</span>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>

          <PopoverContent align="start">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Presets
              </p>

              <div className="grid gap-1">
                {TECH_OPTIONS.map((option) => {
                  const isSelected = selectedTech.some(
                    (item) => item.toLowerCase() === option.toLowerCase(),
                  );

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleTechSelect(option)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]",
                        isSelected && "bg-[#3b82f6]/10 text-[#3b82f6]",
                      )}
                    >
                      <span>{option}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleTechSelect(OTHER_OPTION_VALUE)}
                className="flex w-full items-center justify-between rounded-lg border border-dashed border-border/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-[#3b82f6]/60 hover:text-[#3b82f6]"
              >
                Other (type below)
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTech.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTech.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 rounded-full bg-[#3b82f6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#3b82f6]"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemoveTech(item)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#3b82f6] transition hover:bg-[#3b82f6] hover:text-white"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Pick from the list or choose Other; you can also edit the field directly below.
      </p>

      <Input
        id="tech"
        ref={techInputRef}
        value={tech}
        onChange={(event) => setTech(event.target.value)}
        placeholder="React, TypeScript, Tailwind"
      />
    </div>
  </div>

  <div className="flex items-center gap-2">
    <Button type="submit" className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
      {submitLabel}
    </Button>

    {onCancel && (
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    )}
  </div>
</form>

  );
}
