"use client";

import { useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { HtmlBlock, TaskItem, FeedbackAnnotation } from "@/types";
import { getTagDef } from "./blockDefinitions";
import { generateId } from "./htmlGenerator";
import TagPalette from "./TagPalette";
import BlockNode from "./BlockNode";
import LivePreview from "./LivePreview";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Save, Send, Undo2 } from "lucide-react";

interface HtmlBlockEditorProps {
  task: TaskItem | null;
  blocks: HtmlBlock[];
  onBlocksChange: (blocks: HtmlBlock[]) => void;
  onSave?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  feedback?: string;
  feedbackAnnotations?: FeedbackAnnotation[];
}

function WorkspaceDropZone({
  children,
  readOnly,
}: {
  children: React.ReactNode;
  readOnly?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "workspace-root",
    data: { type: "workspace-root" },
    disabled: readOnly,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] p-3 space-y-2 transition-colors ${
        isOver ? "bg-primary/5" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function HtmlBlockEditor({
  task,
  blocks,
  onBlocksChange,
  onSave,
  onSubmit,
  readOnly,
  feedback,
  feedbackAnnotations = [],
}: HtmlBlockEditorProps) {
  const [activeDragTag, setActiveDragTag] = useState<string | null>(null);
  const [history, setHistory] = useState<HtmlBlock[][]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-20), blocks.map((b) => structuredClone(b))]);
  }, [blocks]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    onBlocksChange(prev);
  }, [history, onBlocksChange]);

  function createBlock(tag: string): HtmlBlock {
    const def = getTagDef(tag);
    return {
      id: generateId(),
      tag,
      content: "",
      children: [],
      attributes: def.attributes.reduce(
        (acc, attr) => ({ ...acc, [attr]: "" }),
        {} as Record<string, string>
      ),
    };
  }

  function addBlockToParent(
    blocks: HtmlBlock[],
    parentId: string,
    newBlock: HtmlBlock
  ): HtmlBlock[] {
    return blocks.map((b) => {
      if (b.id === parentId) {
        return { ...b, children: [...b.children, newBlock] };
      }
      if (b.children.length > 0) {
        return {
          ...b,
          children: addBlockToParent(b.children, parentId, newBlock),
        };
      }
      return b;
    });
  }

  function updateBlockInTree(
    blocks: HtmlBlock[],
    blockId: string,
    updates: Partial<HtmlBlock>
  ): HtmlBlock[] {
    return blocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, ...updates };
      }
      if (b.children.length > 0) {
        return {
          ...b,
          children: updateBlockInTree(b.children, blockId, updates),
        };
      }
      return b;
    });
  }

  function removeBlockFromTree(
    blocks: HtmlBlock[],
    blockId: string
  ): HtmlBlock[] {
    return blocks
      .filter((b) => b.id !== blockId)
      .map((b) => ({
        ...b,
        children: removeBlockFromTree(b.children, blockId),
      }));
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === "palette-tag") {
      setActiveDragTag(data.tag);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragTag(null);
    const { active, over } = event;

    if (!over || !active.data.current) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData.type !== "palette-tag") return;

    const newBlock = createBlock(activeData.tag);
    pushHistory();

    if (over.id === "workspace-root") {
      onBlocksChange([...blocks, newBlock]);
    } else if (overData?.type === "block-drop") {
      const parentDef = getTagDef(overData.tag);
      if (parentDef.canHaveChildren) {
        onBlocksChange(addBlockToParent(blocks, overData.blockId, newBlock));
      }
    }
  }

  function handleUpdate(blockId: string, updates: Partial<HtmlBlock>) {
    pushHistory();
    onBlocksChange(updateBlockInTree(blocks, blockId, updates));
  }

  function handleRemove(blockId: string) {
    pushHistory();
    onBlocksChange(removeBlockFromTree(blocks, blockId));
  }

  const tagDef = activeDragTag ? getTagDef(activeDragTag) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-card">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">HTML редакторы</span>
            {readOnly && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                Тек оқу
              </span>
            )}
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={history.length === 0}
                title="Болдырмау"
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Болдырмау
              </Button>
              {onSave && (
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Сақтау
                </Button>
              )}
              {onSubmit && (
                <Button size="sm" onClick={onSubmit}>
                  <Send className="h-4 w-4 mr-1" />
                  Жіберу
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Tag Palette - left sidebar */}
          <div className="w-56 border-r p-3 overflow-y-auto bg-muted/20 shrink-0">
            <TagPalette
              availableTags={task?.availableTags ?? []}
              disabled={readOnly}
            />
          </div>

          {/* Workspace - center */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto">
              <WorkspaceDropZone readOnly={readOnly}>
                {blocks.length === 0 ? (
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {readOnly
                        ? "Блоктар қойылмаған"
                        : "Палитрадан тегтерді сүйреп, осында тастаңыз"}
                    </p>
                  </div>
                ) : (
                  blocks.map((block) => (
                    <BlockNode
                      key={block.id}
                      block={block}
                      depth={0}
                      onUpdate={handleUpdate}
                      onRemove={handleRemove}
                      readOnly={readOnly}
                      feedbackAnnotations={feedbackAnnotations}
                    />
                  ))
                )}
              </WorkspaceDropZone>
            </div>
          </div>

          {/* Live Preview - right panel */}
          <div className="w-[400px] border-l shrink-0">
            <LivePreview blocks={blocks} />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDragTag && tagDef && (
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-mono font-medium shadow-lg ${tagDef.color}`}
          >
            {tagDef.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
