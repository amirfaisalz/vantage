import type { Variants, Transition, TargetAndTransition } from "framer-motion";

/**
 * Animation presets for Vantage UI
 * Based on PRD specifications for micro-interactions
 */

// Spring entrance - used for sections sliding up
export const springUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

// Fade in - simple opacity transition
export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};

// Scale up - grow into view
export const scaleUpVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

// Blur transition - for data updates
export const blurVariants: Variants = {
    blur: { filter: "blur(4px)", opacity: 0.5 },
    clear: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.3 } },
};

// Stagger container - parent for staggered children
export const staggerContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Stagger item - child in staggered animation
export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

// Tap animation for buttons
export const tapAnimation: TargetAndTransition = {
    scale: 0.95,
};

// Spring transition preset
export const springTransition: Transition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
};

// Fast spring for buttons
export const buttonSpringTransition: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 17,
};

// Gauge animation - for animated charts
export const gaugeVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: (value: number) => ({
        pathLength: value / 100,
        transition: { type: "spring", stiffness: 50, damping: 20, delay: 0.2 },
    }),
};

// Counter animation helper
export const createCounterVariants = (): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 },
    },
});

/**
 * Hook for creating delayed animations
 */
export function useDelayedAnimation(baseDelay: number = 0) {
    return {
        getDelay: (index: number) => baseDelay + index * 0.1,
        variants: (index: number): Variants => ({
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: baseDelay + index * 0.1,
                },
            },
        }),
    };
}

/**
 * Viewport animation options
 */
export const viewportOptions = {
    once: true,
    margin: "-100px",
};
