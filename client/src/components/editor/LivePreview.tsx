"use client";

import { useMemo } from "react";
import { HtmlBlock } from "@/types";
import { blocksToHtml } from "./htmlGenerator";

interface LivePreviewProps {
  blocks: HtmlBlock[];
}

export default function LivePreview({ blocks }: LivePreviewProps) {
  const html = useMemo(() => blocksToHtml(blocks), [blocks]);

  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 24px; margin-bottom: 12px; }
  h2 { font-size: 20px; margin-bottom: 10px; }
  h3 { font-size: 18px; margin-bottom: 8px; }
  p { margin-bottom: 8px; }
  a { color: #2563eb; text-decoration: underline; }
  img { max-width: 100%; height: auto; border-radius: 4px; }
  ul, ol { margin-left: 20px; margin-bottom: 8px; }
  li { margin-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
  th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
  th { background-color: #f3f4f6; font-weight: 600; }
  form { display: flex; flex-direction: column; gap: 8px; }
  input, select, textarea { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; }
  button { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
  label { font-weight: 500; font-size: 14px; }
  header, footer, nav, main, section, article, aside { display: block; }
  header { border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px; }
  footer { border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 16px; }
  nav { display: flex; gap: 12px; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
  div { margin-bottom: 8px; }
</style>
</head>
<body>${html}</body>
</html>`;
  }, [html]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
        <span className="text-xs font-medium text-muted-foreground">
          Live Preview
        </span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts"
          title="Live Preview"
        />
      </div>
    </div>
  );
}
