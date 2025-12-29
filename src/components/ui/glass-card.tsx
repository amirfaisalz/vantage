"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable orange glow effect */
  glow?: boolean;
  /** Enable hover glow animation */
  hoverGlow?: boolean;
  /** Card padding size */
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      children,
      glow = false,
      hoverGlow = true,
      padding = "md",
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Glassmorphism base
          "rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800",
          // Padding
          paddingClasses[padding],
          // Glow effects
          glow && "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
          hoverGlow &&
            "transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

type GlassCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCardHeader = React.forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  )
);
GlassCardHeader.displayName = "GlassCardHeader";

type GlassCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  GlassCardTitleProps
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-zinc-50",
      className
    )}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

type GlassCardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  GlassCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-zinc-400", className)} {...props} />
));
GlassCardDescription.displayName = "GlassCardDescription";

type GlassCardContentProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  GlassCardContentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

type GlassCardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCardFooter = React.forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
);
GlassCardFooter.displayName = "GlassCardFooter";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};
