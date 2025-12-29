"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Loader2, CheckCircle, XCircle } from "lucide-react";

type URLInputStatus = "idle" | "scanning" | "valid" | "invalid";

interface URLInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Callback when URL value changes */
  onValueChange?: (value: string) => void;
  /** Callback when scan is triggered */
  onScan?: (url: string) => void;
  /** Current status of the input */
  status?: URLInputStatus;
  /** Button text */
  buttonText?: string;
  /** Scanning button text */
  scanningText?: string;
}

const URLInput = React.forwardRef<HTMLInputElement, URLInputProps>(
  (
    {
      className,
      onValueChange,
      onScan,
      status = "idle",
      buttonText = "Analyze",
      scanningText = "Scanning",
      placeholder = "Enter URL to analyze...",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onValueChange?.(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value && status !== "scanning") {
        onScan?.(value);
      }
    };

    const isScanning = status === "scanning";

    const statusIcon = {
      idle: <Search className="h-4 w-4 text-zinc-500" />,
      scanning: <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />,
      valid: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      invalid: <XCircle className="h-4 w-4 text-red-500" />,
    };

    return (
      <motion.form
        onSubmit={handleSubmit}
        className={cn(
          // Glassmorphism base
          "relative rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800",
          // Scanning glow animation
          isScanning && "shadow-[0_0_30px_rgba(249,115,22,0.25)]",
          // Transition
          "transition-shadow duration-300",
          className
        )}
        animate={{
          boxShadow: isScanning
            ? [
                "0 0 20px rgba(249, 115, 22, 0.15)",
                "0 0 40px rgba(249, 115, 22, 0.35)",
                "0 0 20px rgba(249, 115, 22, 0.15)",
              ]
            : "0 0 0px rgba(249, 115, 22, 0)",
        }}
        transition={{
          duration: 1.5,
          repeat: isScanning ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Scanning line animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-orange-500 to-transparent"
                animate={{
                  top: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 p-4">
          {/* Status Icon */}
          <div className="shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {statusIcon[status]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input */}
          <input
            ref={ref}
            type="url"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={isScanning}
            className={cn(
              "flex-1 bg-transparent text-zinc-50 placeholder:text-zinc-500",
              "focus:outline-none text-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            {...props}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!value || isScanning}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5",
              "bg-orange-500 text-zinc-950 font-semibold",
              "hover:bg-orange-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
              "disabled:pointer-events-none disabled:opacity-50",
              "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
              "transition-colors"
            )}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {scanningText}
              </>
            ) : (
              buttonText
            )}
          </motion.button>
        </div>
      </motion.form>
    );
  }
);

URLInput.displayName = "URLInput";

export { URLInput, type URLInputStatus, type URLInputProps };
