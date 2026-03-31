"use client";

import { useDraggable } from "@dnd-kit/core";
import { getTagDef, TAG_DEFINITIONS } from "./blockDefinitions";

interface TagPaletteProps {
  availableTags: string[];
  disabled?: boolean;
}

function DraggableTag({ tag, disabled }: { tag: string; disabled?: boolean }) {
  const def = getTagDef(tag);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${tag}`,
    data: { type: "palette-tag", tag },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-mono font-medium cursor-grab active:cursor-grabbing select-none transition-all ${def.color} ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {def.label}
    </div>
  );
}

export default function TagPalette({ availableTags, disabled }: TagPaletteProps) {
  const tags = Array.isArray(availableTags) ? availableTags : [];
  const grouped = new Map<string, string[]>();

  for (const tag of tags) {
    const def = TAG_DEFINITIONS[tag];
    const cat = def?.category || "Other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(tag);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Қолжетімді тегтер
      </h3>
      {Array.from(grouped.entries()).map(([category, tags]) => (
        <div key={category}>
          <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase">
            {category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <DraggableTag key={tag} tag={tag} disabled={disabled} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
