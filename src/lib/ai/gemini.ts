import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, AISuggestion } from "@/lib/pagespeed";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Fetch and extract key HTML elements for performance analysis
 */
async function extractHtmlContext(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; VantageBot/1.0)",
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            return "Unable to fetch HTML content.";
        }

        const html = await response.text();

        // Extract key performance-related elements
        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        const head = headMatch ? headMatch[1] : "";

        // Extract meta tags
        const metaTags = head.match(/<meta[^>]*>/gi) || [];
        const relevantMeta = metaTags.slice(0, 10).join("\n");

        // Extract script tags (src and type)
        const scriptTags = html.match(/<script[^>]*>/gi) || [];
        const scriptInfo = scriptTags.slice(0, 15).map((tag) => {
            const src = tag.match(/src=["']([^"']+)["']/i)?.[1] || "inline";
            const hasAsync = tag.includes("async") ? "async" : "";
            const hasDefer = tag.includes("defer") ? "defer" : "";
            return `- ${src} ${hasAsync} ${hasDefer}`.trim();
        });

        // Extract link tags (stylesheets, preload, prefetch)
        const linkTags = html.match(/<link[^>]*>/gi) || [];
        const linkInfo = linkTags.slice(0, 15).map((tag) => {
            const href = tag.match(/href=["']([^"']+)["']/i)?.[1] || "";
            const rel = tag.match(/rel=["']([^"']+)["']/i)?.[1] || "";
            return `- ${rel}: ${href}`;
        });

        // Extract image count and first few images
        const imgTags = html.match(/<img[^>]*>/gi) || [];
        const imgInfo = imgTags.slice(0, 5).map((tag) => {
            const src = tag.match(/src=["']([^"']+)["']/i)?.[1] || "";
            const loading = tag.includes('loading="lazy"') ? "(lazy)" : "(eager)";
            const hasSize = tag.includes("width=") && tag.includes("height=");
            return `- ${src.substring(0, 60)} ${loading} ${hasSize ? "✓ sized" : "✗ no dimensions"}`;
        });

        // Check for common frameworks
        const frameworks: string[] = [];
        if (html.includes("__NEXT_DATA__") || html.includes("_next/static")) frameworks.push("Next.js");
        if (html.includes("__NUXT__")) frameworks.push("Nuxt");
        if (html.includes("data-reactroot") || html.includes("__REACT")) frameworks.push("React");
        if (html.includes("ng-version") || html.includes("ng-app")) frameworks.push("Angular");
        if (html.includes("data-v-")) frameworks.push("Vue");
        if (html.includes("wp-content") || html.includes("wp-includes")) frameworks.push("WordPress");

        // Check for performance issues
        const issues: string[] = [];
        if (html.includes('<script src="') && !html.includes("async") && !html.includes("defer")) {
            issues.push("Render-blocking scripts detected (no async/defer)");
        }
        if (imgTags.length > 0 && imgTags.some((t) => !t.includes("width=") || !t.includes("height="))) {
            issues.push("Images without explicit dimensions (CLS risk)");
        }
        if (!html.includes("font-display")) {
            issues.push("Fonts may not use font-display (FOIT risk)");
        }
        if (html.length > 200000) {
            issues.push(`Large HTML document (${Math.round(html.length / 1024)}KB)`);
        }

        return `
## Detected Frameworks
${frameworks.length > 0 ? frameworks.join(", ") : "Unknown/Static"}

## Potential Issues Found
${issues.length > 0 ? issues.map((i) => `- ${i}`).join("\n") : "- None detected"}

## Scripts (${scriptTags.length} total)
${scriptInfo.slice(0, 10).join("\n")}

## Stylesheets/Links (${linkTags.length} total)
${linkInfo.slice(0, 10).join("\n")}

## Images (${imgTags.length} total)
${imgInfo.join("\n")}

## Meta Tags
${relevantMeta}
`.trim();
    } catch (error) {
        console.warn("Failed to fetch HTML:", error);
        return "Unable to fetch HTML content for analysis.";
    }
}

/**
 * Build the prompt for Gemini based on analysis results
 */
async function buildPrompt(result: AnalysisResult): Promise<string> {
    const metrics = result.metrics;
    const categoryScores = result.categoryScores;
    const opportunities = result.opportunities?.slice(0, 5) || [];
    const diagnostics = result.diagnostics?.slice(0, 5) || [];

    // Fetch HTML context for more precise suggestions
    const htmlContext = await extractHtmlContext(result.finalUrl || result.url);

    return `You are a web performance expert. Analyze the following PageSpeed Insights results AND the HTML structure to provide precise, actionable optimization suggestions specific to this website.

## Website Analysis
- **URL:** ${result.url}
- **Final URL:** ${result.finalUrl}
- **Strategy:** ${result.strategy}
- **Performance Score:** ${result.performanceScore}/100

## Core Web Vitals
- **LCP (Largest Contentful Paint):** ${metrics.lcp.value}s (${metrics.lcp.rating})
- **CLS (Cumulative Layout Shift):** ${metrics.cls.value} (${metrics.cls.rating})
- **FID (First Input Delay):** ${metrics.fid.value}ms (${metrics.fid.rating})
${metrics.inp ? `- **INP (Interaction to Next Paint):** ${metrics.inp.value}ms (${metrics.inp.rating})` : ""}
${metrics.fcp ? `- **FCP (First Contentful Paint):** ${metrics.fcp.value}s (${metrics.fcp.rating})` : ""}
${metrics.ttfb ? `- **TTFB (Time to First Byte):** ${metrics.ttfb.value}ms (${metrics.ttfb.rating})` : ""}

## Category Scores
- **Accessibility:** ${categoryScores?.accessibility ?? "N/A"}/100
- **Best Practices:** ${categoryScores?.bestPractices ?? "N/A"}/100
- **SEO:** ${categoryScores?.seo ?? "N/A"}/100

## Top Opportunities from Lighthouse
${opportunities.map((o) => `- ${o.title}: ${o.displayValue || "N/A"}`).join("\n")}

## Diagnostics
${diagnostics.map((d) => `- ${d.title}: ${d.displayValue || "N/A"}`).join("\n")}

## HTML Analysis
${htmlContext}

## Instructions
Based on the SPECIFIC HTML structure and detected issues above, provide 3-5 prioritized suggestions that are unique to this website. For each suggestion:
1. Reference specific elements you found in the HTML (e.g., "I noticed you have 15 scripts...")
2. Provide concrete, copy-paste ready code examples
3. Be specific about file names and paths when possible

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "suggestions": [
    {
      "metric": "LCP|CLS|INP|FCP|TTFB|Performance|Accessibility|SEO",
      "title": "Short actionable title",
      "priority": "high|medium|low",
      "impact": "Brief impact description",
      "suggestion": "Detailed explanation referencing specific findings from the HTML analysis",
      "codeExample": "// Specific code example for this site",
      "currentValue": "Current metric value",
      "targetValue": "Target value to achieve"
    }
  ]
}`;
}

/**
 * Parse Gemini response into AISuggestion array
 */
function parseGeminiResponse(text: string): AISuggestion[] {
    try {
        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.slice(7);
        }
        if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith("```")) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        const data = JSON.parse(cleanedText);

        if (!data.suggestions || !Array.isArray(data.suggestions)) {
            throw new Error("Invalid response format");
        }

        return data.suggestions.map((s: Record<string, unknown>, index: number) => {
            let codeExample = s.codeExample ? String(s.codeExample) : undefined;

            // Clean markdown fences from code example if present
            if (codeExample) {
                codeExample = codeExample.replace(/^```[a-z]*\n/i, "").replace(/\n```$/, "");
            }

            return {
                id: `gemini-${Date.now()}-${index}`,
                metric: String(s.metric || "Performance"),
                title: String(s.title || "Optimization Suggestion"),
                priority: (s.priority as "high" | "medium" | "low") || "medium",
                impact: String(s.impact || ""),
                suggestion: String(s.suggestion || ""),
                codeExample,
                currentValue: String(s.currentValue || ""),
                targetValue: String(s.targetValue || ""),
            };
        });
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        throw new Error("Failed to parse AI response");
    }
}

/**
 * Generate AI suggestions using Gemini
 */
export async function generateGeminiSuggestions(
    result: AnalysisResult
): Promise<AISuggestion[]> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = await buildPrompt(result);

    try {
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        return parseGeminiResponse(text);
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
}
