/**
 * Mock Segment Analytics
 * Simulates Segment track/identify/page calls
 */

import { useTrackingStore } from "@/lib/tracking/store";

export interface SegmentTraits {
    [key: string]: string | number | boolean | undefined;
}

export interface SegmentProperties {
    [key: string]: unknown;
}

/**
 * Mock Segment analytics client
 * All calls are logged to the tracking pipeline for visualization
 */
export const segment = {
    /**
     * Track an event
     */
    track: (event: string, properties?: SegmentProperties) => {
        console.log(`[Segment] track("${event}")`, properties);

        // Add to tracking store
        const store = useTrackingStore.getState();
        store.addEvent(`Segment: ${event}`, "interaction", {
            source: "segment",
            ...properties,
        });

        return { success: true, event };
    },

    /**
     * Identify a user
     */
    identify: (userId: string, traits?: SegmentTraits) => {
        console.log(`[Segment] identify("${userId}")`, traits);

        const store = useTrackingStore.getState();
        store.addEvent("Segment: User Identified", "interaction", {
            source: "segment",
            userId,
            ...traits,
        });

        return { success: true, userId };
    },

    /**
     * Track a page view
     */
    page: (name?: string, properties?: SegmentProperties) => {
        console.log(`[Segment] page("${name || "Page View"}")`, properties);

        const store = useTrackingStore.getState();
        store.addEvent(`Segment: ${name || "Page View"}`, "page", {
            source: "segment",
            ...properties,
        });

        return { success: true, name };
    },

    /**
     * Group a user into a company/organization
     */
    group: (groupId: string, traits?: SegmentTraits) => {
        console.log(`[Segment] group("${groupId}")`, traits);

        const store = useTrackingStore.getState();
        store.addEvent("Segment: Group", "interaction", {
            source: "segment",
            groupId,
            ...traits,
        });

        return { success: true, groupId };
    },

    /**
     * Alias a user ID
     */
    alias: (newId: string, previousId?: string) => {
        console.log(`[Segment] alias("${newId}", "${previousId}")`);

        const store = useTrackingStore.getState();
        store.addEvent("Segment: Alias", "interaction", {
            source: "segment",
            newId,
            previousId,
        });

        return { success: true, newId };
    },
};

/**
 * React hook for Segment analytics
 */
export function useSegment() {
    return segment;
}
