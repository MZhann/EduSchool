import { HtmlBlock } from "@/types";
import { getTagDef } from "./blockDefinitions";

export function blocksToHtml(blocks: HtmlBlock[]): string {
  return blocks.map(blockToHtml).join("");
}

function blockToHtml(block: HtmlBlock): string {
  const def = getTagDef(block.tag);
  const attrs = Object.entries(block.attributes || {})
    .filter(([, v]) => v)
    .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
    .join("");

  if (def.selfClosing) {
    return `<${block.tag}${attrs}>`;
  }

  const childrenHtml = block.children.map(blockToHtml).join("");
  const content = escapeHtml(block.content || "");

  return `<${block.tag}${attrs}>${content}${childrenHtml}</${block.tag}>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
