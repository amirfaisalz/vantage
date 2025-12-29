/**
 * Tracking Event Types
 * Modeled after Segment/Mixpanel event structure
 */

export type EventCategory = "analysis" | "calculator" | "interaction" | "page";

export interface TrackingEvent {
    id: string;
    name: string;
    category: EventCategory;
    properties: Record<string, unknown>;
    timestamp: Date;
}

export interface EventProperties {
    [key: string]: string | number | boolean | undefined;
}

// Predefined event names for type safety
export const EventNames = {
    // Analysis events
    ANALYSIS_STARTED: "Analysis_Started",
    ANALYSIS_COMPLETE: "Analysis_Complete",
    ANALYSIS_ERROR: "Analysis_Error",
    DEVICE_TOGGLED: "Device_Toggled",

    // Calculator events
    CALCULATOR_TRAFFIC_CHANGED: "Calculator_Traffic_Changed",
    CALCULATOR_AOV_CHANGED: "Calculator_AOV_Changed",
    CALCULATOR_CONVERSION_CHANGED: "Calculator_Conversion_Changed",
    CALCULATOR_LOADTIME_CHANGED: "Calculator_LoadTime_Changed",

    // Interaction events
    CHART_HOVERED: "Chart_Hovered",
    TOGGLE_RAW_VIEW: "Toggle_Raw_View",

    // Page events
    PAGE_VIEW: "Page_View",
} as const;

export type EventName = (typeof EventNames)[keyof typeof EventNames];
