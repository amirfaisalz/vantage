"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useTrackingStore,
  type TrackingEvent,
  type EventCategory,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { Activity, X, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const categoryColors: Record<EventCategory, string> = {
  analysis: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  calculator: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  interaction: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  page: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function EventItem({ event }: { event: TrackingEvent }) {
  const [expanded, setExpanded] = useState(false);
  const hasProperties = Object.keys(event.properties).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="border-b border-zinc-800 last:border-b-0"
    >
      <button
        onClick={() => hasProperties && setExpanded(!expanded)}
        className={cn(
          "w-full px-3 py-2.5 text-left transition-colors",
          hasProperties && "hover:bg-zinc-800/50 cursor-pointer"
        )}
        disabled={!hasProperties}
      >
        <div className="flex items-start gap-2">
          {hasProperties ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
            )
          ) : (
            <div className="w-3.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                  categoryColors[event.category]
                )}
              >
                {event.category}
              </span>
              <span className="text-xs font-medium text-zinc-200 truncate">
                {event.name}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {formatTime(event.timestamp)}
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && hasProperties && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <pre className="px-3 pb-2.5 text-[10px] text-zinc-400 font-mono bg-zinc-900/50 mx-3 mb-2 rounded p-2 overflow-x-auto">
              {JSON.stringify(event.properties, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EventLogSidebar() {
  const { events, isOpen, toggleSidebar, clearEvents } = useTrackingStore();

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleSidebar}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50",
          "flex items-center gap-1.5 px-2 py-3 rounded-l-lg",
          "bg-zinc-900 border border-r-0 border-zinc-700",
          "text-zinc-400 hover:text-orange-400 transition-colors",
          "shadow-lg"
        )}
      >
        <Activity className="h-4 w-4" />
        {events.length > 0 && (
          <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-orange-500 text-[10px] font-bold text-zinc-900">
            {events.length}
          </span>
        )}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed right-0 top-0 bottom-0 z-50",
                "w-80 max-w-[90vw]",
                "bg-zinc-900 border-l border-zinc-800",
                "flex flex-col shadow-2xl"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-400" />
                  <h2 className="text-sm font-semibold text-zinc-200">
                    Event Log
                  </h2>
                  <span className="text-xs text-zinc-500">
                    ({events.length})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {events.length > 0 && (
                    <button
                      onClick={clearEvents}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Clear events"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Event List */}
              <div className="flex-1 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <Activity className="h-8 w-8 text-zinc-700 mb-2" />
                    <p className="text-sm text-zinc-500">No events yet</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Interact with the page to see events
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    {events.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-zinc-800 text-[10px] text-zinc-600">
                Tracking sandbox • Events are not persisted
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
