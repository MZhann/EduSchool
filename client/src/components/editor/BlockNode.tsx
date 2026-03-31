"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { HtmlBlock, FeedbackAnnotation } from "@/types";
import { getTagDef } from "./blockDefinitions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronRight, MessageCircle } from "lucide-react";

interface BlockNodeProps {
  block: HtmlBlock;
  depth: number;
  onUpdate: (blockId: string, updates: Partial<HtmlBlock>) => void;
  onRemove: (blockId: string) => void;
  readOnly?: boolean;
  feedbackAnnotations?: FeedbackAnnotation[];
}

export default function BlockNode({
  block,
  depth,
  onUpdate,
  onRemove,
  readOnly,
  feedbackAnnotations = [],
}: BlockNodeProps) {
  const [collapsed, setCollapsed] = useState(false);
  const def = getTagDef(block.tag);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${block.id}`,
    data: { type: "block-drop", blockId: block.id, tag: block.tag },
    disabled: readOnly || !def.canHaveChildren,
  });

  const annotation = feedbackAnnotations.find((a) => a.blockId === block.id);
  const hasChildren = block.children.length > 0;

  return (
    <div
      className={`relative ${depth > 0 ? "ml-4" : ""}`}
      style={{ marginLeft: depth > 0 ? `${Math.min(depth * 16, 64)}px` : undefined }}
    >
      <div
        ref={setNodeRef}
        className={`group rounded-lg border transition-all ${def.color} ${
          isOver ? "ring-2 ring-primary ring-offset-1" : ""
        } ${annotation ? "ring-2 ring-orange-400" : ""}`}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          {hasChildren && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-0.5 hover:bg-black/10 rounded"
            >
              {collapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}

          <span className="text-xs font-mono font-bold shrink-0">
            &lt;{block.tag}&gt;
          </span>

          {def.canHaveText && !readOnly && (
            <Input
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Enter text content..."
              className="h-6 text-xs bg-white/50 border-0 focus-visible:ring-1 flex-1 min-w-[100px]"
            />
          )}

          {def.canHaveText && readOnly && block.content && (
            <span className="text-xs truncate flex-1">{block.content}</span>
          )}

          {def.attributes.map((attr) => (
            <div key={attr} className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{attr}=</span>
              {!readOnly ? (
                <Input
                  value={block.attributes[attr] || ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      attributes: { ...block.attributes, [attr]: e.target.value },
                    })
                  }
                  placeholder={attr}
                  className="h-6 text-xs bg-white/50 border-0 focus-visible:ring-1 w-24"
                />
              ) : (
                <span className="text-xs">{block.attributes[attr] || ""}</span>
              )}
            </div>
          ))}

          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={() => onRemove(block.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>

        {annotation && (
          <div className="mx-3 mb-2 px-2 py-1.5 bg-orange-50 border border-orange-200 rounded text-xs flex items-start gap-1.5">
            <MessageCircle className="h-3 w-3 text-orange-500 mt-0.5 shrink-0" />
            <span className="text-orange-700">{annotation.comment}</span>
          </div>
        )}

        {!collapsed && hasChildren && (
          <div className="px-2 pb-2 space-y-1">
            {block.children.map((child) => (
              <BlockNode
                key={child.id}
                block={child}
                depth={depth + 1}
                onUpdate={onUpdate}
                onRemove={onRemove}
                readOnly={readOnly}
                feedbackAnnotations={feedbackAnnotations}
              />
            ))}
          </div>
        )}

        {!collapsed && def.canHaveChildren && !readOnly && (
          <div
            className={`mx-2 mb-2 border-2 border-dashed rounded-md p-2 text-center text-[10px] text-muted-foreground transition-colors ${
              isOver ? "border-primary bg-primary/5" : "border-muted"
            }`}
          >
            Drop child tags here
          </div>
        )}

        {!def.selfClosing && (
          <div className="flex items-center px-3 py-1 border-t border-inherit/20 opacity-60">
            <span className="text-xs font-mono font-bold">
              &lt;/{block.tag}&gt;
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
