"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TransparencyToggleProps {
  /** Current state - true means showing raw/transparent view */
  value: boolean;
  /** Callback when toggled */
  onChange: (value: boolean) => void;
  /** Label for formatted view */
  formattedLabel?: string;
  /** Label for raw view */
  rawLabel?: string;
  /** Additional class names */
  className?: string;
}

const TransparencyToggle = React.forwardRef<
  HTMLDivElement,
  TransparencyToggleProps
>(
  (
    {
      value,
      onChange,
      formattedLabel = "Formatted",
      rawLabel = "Raw JSON",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-800/50 border border-zinc-700",
          className
        )}
      >
        {/* Formatted option */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            !value ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {!value && (
            <motion.div
              layoutId="toggle-bg"
              className="absolute inset-0 bg-orange-500 rounded-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{formattedLabel}</span>
        </button>

        {/* Raw option */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            value ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {value && (
            <motion.div
              layoutId="toggle-bg"
              className="absolute inset-0 bg-orange-500 rounded-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{rawLabel}</span>
        </button>
      </div>
    );
  }
);

TransparencyToggle.displayName = "TransparencyToggle";

export { TransparencyToggle, type TransparencyToggleProps };
