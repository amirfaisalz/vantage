import { create } from "zustand";
import type { TrackingEvent, EventCategory, EventProperties } from "./types";

interface TrackingStore {
    events: TrackingEvent[];
    isOpen: boolean;
    addEvent: (
        name: string,
        category: EventCategory,
        properties?: EventProperties
    ) => void;
    clearEvents: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

const MAX_EVENTS = 50;

function generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useTrackingStore = create<TrackingStore>((set) => ({
    events: [],
    isOpen: false,

    addEvent: (name, category, properties = {}) => {
        const event: TrackingEvent = {
            id: generateId(),
            name,
            category,
            properties,
            timestamp: new Date(),
        };

        set((state) => ({
            events: [event, ...state.events].slice(0, MAX_EVENTS),
        }));
    },

    clearEvents: () => set({ events: [] }),

    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

    setSidebarOpen: (open) => set({ isOpen: open }),
}));
