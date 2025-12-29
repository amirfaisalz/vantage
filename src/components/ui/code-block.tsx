"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface CodeBlockProps {
  /** Code content to display */
  code: string | object;
  /** Language for syntax highlighting hint */
  language?: "json" | "javascript" | "typescript" | "html";
  /** Title for the code block */
  title?: string;
  /** Enable collapsible behavior */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Additional class names */
  className?: string;
}

// Simple syntax highlighting for JSON
const highlightJSON = (str: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let key = 0;

  // Regex patterns for JSON tokens
  const patterns = [
    { regex: /"([^"\\]|\\.)*"(?=\s*:)/g, className: "text-orange-400" }, // Keys
    { regex: /"([^"\\]|\\.)*"(?!\s*:)/g, className: "text-emerald-400" }, // String values
    { regex: /\b(true|false|null)\b/g, className: "text-purple-400" }, // Boolean/null
    { regex: /\b-?\d+\.?\d*\b/g, className: "text-blue-400" }, // Numbers
  ];

  // Split and highlight
  const remaining = str;
  let lastIndex = 0;

  // Find all matches
  const matches: {
    start: number;
    end: number;
    text: string;
    className: string;
  }[] = [];

  patterns.forEach(({ regex, className }) => {
    let match;
    const re = new RegExp(regex.source, "g");
    while ((match = re.exec(str)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className,
      });
    }
  });

  // Sort by position
  matches.sort((a, b) => a.start - b.start);

  // Filter overlapping matches
  const filtered: typeof matches = [];
  for (const match of matches) {
    const last = filtered[filtered.length - 1];
    if (!last || match.start >= last.end) {
      filtered.push(match);
    }
  }

  // Build highlighted output
  for (const match of filtered) {
    if (match.start > lastIndex) {
      parts.push(
        <span key={key++} className="text-zinc-400">
          {remaining.slice(lastIndex, match.start)}
        </span>
      );
    }
    parts.push(
      <span key={key++} className={match.className}>
        {match.text}
      </span>
    );
    lastIndex = match.end;
  }

  if (lastIndex < str.length) {
    parts.push(
      <span key={key++} className="text-zinc-400">
        {str.slice(lastIndex)}
      </span>
    );
  }

  return parts;
};

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "json",
      title,
      collapsible = false,
      defaultCollapsed = false,
      maxHeight = 400,
      className,
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    // Format code
    const formattedCode =
      typeof code === "object" ? JSON.stringify(code, null, 2) : code;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(formattedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    const highlightedCode =
      language === "json" ? highlightJSON(formattedCode) : formattedCode;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 overflow-hidden",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            {/* Decorative dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-600" />
              <div className="w-3 h-3 rounded-full bg-zinc-600" />
              <div className="w-3 h-3 rounded-full bg-zinc-600" />
            </div>
            {title && (
              <span className="text-sm font-medium text-zinc-400">{title}</span>
            )}
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-400 uppercase">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy button */}
            <motion.button
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                copied
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              )}
              whileTap={{ scale: 0.95 }}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.button>

            {/* Collapse button */}
            {collapsible && (
              <motion.button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {collapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Code content */}
        <motion.div
          initial={false}
          animate={{
            height: collapsed ? 0 : "auto",
            opacity: collapsed ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className="p-4 overflow-auto font-mono text-sm"
            style={{ maxHeight }}
          >
            <pre className="whitespace-pre-wrap wrap-break-word">
              {highlightedCode}
            </pre>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export { CodeBlock, type CodeBlockProps };
