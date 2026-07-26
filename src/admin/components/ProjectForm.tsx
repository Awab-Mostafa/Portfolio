import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/firebase";
import type { ProjectImage } from "@/admin/context/ProjectsContext";

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

// Represents one image row in the form. `file` holds a newly picked file that
// still needs to be uploaded. `url` holds an already-uploaded/existing image.
type ImageDraft = {
  localId: string;
  file?: File;
  previewUrl: string;
  url?: string;
  caption: string;
  role: string;
  uploading: boolean;
  error?: string;
};

export type ProjectFormValues = {
  title: string;
  description: string;
  tech: string;
  url: string;
  images: ProjectImage[];
};

export type ProjectFormProps = {
  initialValues?: Partial<ProjectFormValues>;
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

function parseTechList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createLocalId() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function ProjectForm({ initialValues, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [tech, setTech] = useState(initialValues?.tech ?? "");
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const [images, setImages] = useState<ImageDraft[]>(
    () =>
      initialValues?.images?.map((image) => ({
        localId: createLocalId(),
        url: image.url,
        previewUrl: image.url,
        caption: image.caption ?? "",
        role: image.role ?? "",
        uploading: false,
      })) ?? [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const techInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newDrafts: ImageDraft[] = Array.from(fileList).map((file) => ({
      localId: createLocalId(),
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
      role: "",
      uploading: false,
    }));
    setImages((prev) => [...prev, ...newDrafts]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (localId: string) => {
    setImages((prev) => prev.filter((image) => image.localId !== localId));
  };

  const handleImageFieldChange = (localId: string, field: "caption" | "role", value: string) => {
    setImages((prev) =>
      prev.map((image) => (image.localId === localId ? { ...image, [field]: value } : image)),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Upload any newly-picked files that don't have a hosted URL yet.
      const uploadedImages: ProjectImage[] = [];
      for (const image of images) {
        if (image.url) {
          uploadedImages.push({
            url: image.url,
            caption: image.caption.trim(),
            role: image.role.trim(),
          });
          continue;
        }

        if (image.file) {
          setImages((prev) =>
            prev.map((item) => (item.localId === image.localId ? { ...item, uploading: true } : item)),
          );
          const path = `projects/${Date.now()}-${image.file.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, image.file);
          const downloadUrl = await getDownloadURL(storageRef);
          uploadedImages.push({
            url: downloadUrl,
            caption: image.caption.trim(),
            role: image.role.trim(),
          });
        }
      }

      const normalizedTech = parseTechList(tech).join(", ");
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        tech: normalizedTech,
        url: url.trim(),
        images: uploadedImages,
      });
    } catch (error) {
      console.error("Failed to save project:", error);
      setSubmitError("Something went wrong while uploading images. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Provide a short summary of the project goals"
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

      <div className="grid gap-2">
        <Label>Project Images</Label>
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/70 p-4">
          <p className="text-xs text-muted-foreground">
            Optional. Upload screenshots from the project itself, then describe each one and note your
            role in it (e.g. "Built the checkout flow" or "Designed the dashboard UI").
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => handleFilesSelected(event.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background text-sm font-medium text-muted-foreground transition hover:border-[#3b82f6]/50 hover:text-[#3b82f6]"
          >
            <ImagePlus className="h-4 w-4" />
            Add image(s)
          </button>

          {images.length > 0 && (
            <div className="grid gap-4">
              {images.map((image) => (
                <div
                  key={image.localId}
                  className="grid gap-3 rounded-xl border border-border/60 p-3 sm:grid-cols-[120px_1fr]"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-lg border border-border/50 bg-black/20 sm:h-full">
                    <img
                      src={image.previewUrl}
                      alt={image.caption || "Project image"}
                      className="h-full w-full object-cover"
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.localId)}
                      className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label className="text-xs text-muted-foreground">Description / caption</Label>
                      <Input
                        value={image.caption}
                        onChange={(event) =>
                          handleImageFieldChange(image.localId, "caption", event.target.value)
                        }
                        placeholder="What does this screenshot show?"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-xs text-muted-foreground">Your role in it</Label>
                      <Input
                        value={image.role}
                        onChange={(event) =>
                          handleImageFieldChange(image.localId, "role", event.target.value)
                        }
                        placeholder="e.g. Built the frontend for this screen"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </Button>

        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}