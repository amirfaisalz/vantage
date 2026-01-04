/**
 * Mock GTM DataLayer
 * Simulates Google Tag Manager dataLayer pushes
 */

import { useTrackingStore } from "@/lib/tracking/store";

export interface DataLayerEvent {
    event: string;
    [key: string]: unknown;
}

declare global {
    interface Window {
        dataLayer?: DataLayerEvent[];
    }
}

/**
 * Initialize mock dataLayer
 */
export function initDataLayer(): void {
    if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
    }
}

/**
 * Push an event to the dataLayer
 */
export function pushToDataLayer(data: DataLayerEvent): void {
    if (typeof window === "undefined") return;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push to dataLayer
    window.dataLayer.push(data);

    // Log to console
    console.log("[GTM] dataLayer.push()", data);

    // Add to tracking store for visualization
    const store = useTrackingStore.getState();
    store.addEvent(`GTM: ${data.event}`, "interaction", {
        source: "gtm",
        ...data,
    });
}

/**
 * Common GTM event helpers
 */
export const gtm = {
    /**
     * Track page view
     */
    pageView: (pagePath: string, pageTitle: string) => {
        pushToDataLayer({
            event: "page_view",
            page_path: pagePath,
            page_title: pageTitle,
        });
    },

    /**
     * Track form submission
     */
    formSubmit: (formId: string, formName: string) => {
        pushToDataLayer({
            event: "form_submit",
            form_id: formId,
            form_name: formName,
        });
    },

    /**
     * Track button click
     */
    buttonClick: (buttonId: string, buttonText: string) => {
        pushToDataLayer({
            event: "button_click",
            button_id: buttonId,
            button_text: buttonText,
        });
    },

    /**
     * Track e-commerce purchase
     */
    purchase: (transactionId: string, value: number, currency: string = "USD") => {
        pushToDataLayer({
            event: "purchase",
            transaction_id: transactionId,
            value,
            currency,
        });
    },

    /**
     * Track signup
     */
    signUp: (method: string) => {
        pushToDataLayer({
            event: "sign_up",
            method,
        });
    },

    /**
     * Track analysis event (custom for Vantage)
     */
    analysisComplete: (url: string, performanceScore: number, strategy: string) => {
        pushToDataLayer({
            event: "analysis_complete",
            url_analyzed: url,
            performance_score: performanceScore,
            strategy,
        });
    },

    /**
     * Generic custom event
     */
    custom: (eventName: string, eventData: Record<string, unknown>) => {
        pushToDataLayer({
            event: eventName,
            ...eventData,
        });
    },
};

/**
 * React hook for GTM
 */
export function useGTM() {
    return { gtm, pushToDataLayer, initDataLayer };
}
