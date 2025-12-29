"use client";

import { useCallback } from "react";
import { useTrackingStore, type EventCategory, type EventProperties } from "@/lib/tracking";

/**
 * Hook for tracking events
 * Returns a track function that logs events to the tracking store
 */
export function useTrackEvent() {
    const addEvent = useTrackingStore((state) => state.addEvent);

    const track = useCallback(
        (name: string, category: EventCategory, properties?: EventProperties) => {
            addEvent(name, category, properties);

            // Also log to console in development
            if (process.env.NODE_ENV === "development") {
                console.log(
                    `%c[Track] ${name}`,
                    "color: #f97316; font-weight: bold;",
                    properties
                );
            }
        },
        [addEvent]
    );

    return { track };
}
