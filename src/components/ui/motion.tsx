"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation presets matching the PRD specifications
export const animations = {
  // Spring entrance effect
  springUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  // Scale up
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  // Button tap effect
  tap: {
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  // Data blur effect for value updates
  blur: {
    initial: { filter: "blur(4px)", opacity: 0.5 },
    animate: { filter: "blur(0px)", opacity: 1 },
    transition: { duration: 0.3 },
  },
} as const;

// Stagger children animation
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Motion Div with spring entrance
interface MotionDivProps extends HTMLMotionProps<"div"> {
  preset?: "springUp" | "fadeIn" | "scaleUp" | "blur";
}

const springUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 100, damping: 15 },
};

const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

const scaleUpAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring" as const, stiffness: 100, damping: 15 },
};

const blurAnimation = {
  initial: { filter: "blur(4px)", opacity: 0.5 },
  animate: { filter: "blur(0px)", opacity: 1 },
  transition: { duration: 0.3 },
};

const animationPresets = {
  springUp: springUpAnimation,
  fadeIn: fadeInAnimation,
  scaleUp: scaleUpAnimation,
  blur: blurAnimation,
};

export const MotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ className, preset = "springUp", children, ...props }, ref) => {
    const animation = animationPresets[preset];

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionDiv.displayName = "MotionDiv";

// Motion Button with tap effect
interface MotionButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "primary" | "ghost";
}

export const MotionButton = React.forwardRef<
  HTMLButtonElement,
  MotionButtonProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const variantClasses = {
    default:
      "bg-zinc-800 text-zinc-50 hover:bg-zinc-700 border border-zinc-700",
    primary:
      "bg-orange-500 text-zinc-950 hover:bg-orange-400 font-semibold shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    ghost: "bg-transparent text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800",
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
MotionButton.displayName = "MotionButton";

// Motion Section wrapper
interface MotionSectionProps extends HTMLMotionProps<"section"> {
  delay?: number;
}

export const MotionSection = React.forwardRef<HTMLElement, MotionSectionProps>(
  ({ className, delay = 0, children, ...props }, ref) => {
    return (
      <motion.section
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay,
        }}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
);
MotionSection.displayName = "MotionSection";

// Stagger Container for lists
type StaggerContainerProps = HTMLMotionProps<"div">;

export const StaggerContainer = React.forwardRef<
  HTMLDivElement,
  StaggerContainerProps
>(({ className, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
});
StaggerContainer.displayName = "StaggerContainer";

// Stagger Item for list items
type StaggerItemProps = HTMLMotionProps<"div">;

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={staggerItem}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";
