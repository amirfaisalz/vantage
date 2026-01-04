/**
 * A/B Testing Statistics
 * Statistical calculations for experiment analysis
 */

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, visitors: number): number {
    if (visitors === 0) return 0;
    return (conversions / visitors) * 100;
}

/**
 * Calculate z-score for proportion comparison
 */
function calculateZScore(
    convA: number,
    visitorsA: number,
    convB: number,
    visitorsB: number
): number {
    const pA = visitorsA > 0 ? convA / visitorsA : 0;
    const pB = visitorsB > 0 ? convB / visitorsB : 0;
    const pPooled = (convA + convB) / (visitorsA + visitorsB);

    if (pPooled === 0 || pPooled === 1) return 0;

    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
    if (se === 0) return 0;

    return (pA - pB) / se;
}

/**
 * Convert z-score to p-value (two-tailed)
 */
function zScoreToPValue(z: number): number {
    // Approximation of cumulative normal distribution
    const absZ = Math.abs(z);
    const t = 1 / (1 + 0.2316419 * absZ);
    const d = 0.3989423 * Math.exp((-absZ * absZ) / 2);
    const p =
        d *
        t *
        (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

    return 2 * p; // Two-tailed
}

/**
 * Calculate confidence level (1 - p-value)
 */
export function calculateConfidence(
    controlConv: number,
    controlVisitors: number,
    variantConv: number,
    variantVisitors: number
): number {
    const zScore = calculateZScore(controlConv, controlVisitors, variantConv, variantVisitors);
    const pValue = zScoreToPValue(zScore);
    return Math.min(99.99, (1 - pValue) * 100);
}

/**
 * Determine if result is statistically significant (95% confidence)
 */
export function isStatisticallySignificant(confidence: number): boolean {
    return confidence >= 95;
}

/**
 * Calculate uplift percentage
 */
export function calculateUplift(
    controlConv: number,
    controlVisitors: number,
    variantConv: number,
    variantVisitors: number
): number {
    const controlRate = calculateConversionRate(controlConv, controlVisitors);
    const variantRate = calculateConversionRate(variantConv, variantVisitors);

    if (controlRate === 0) return 0;
    return ((variantRate - controlRate) / controlRate) * 100;
}

/**
 * Required sample size for given effect size (power analysis)
 */
export function requiredSampleSize(
    baselineRate: number,
    minimumDetectableEffect: number,
    power: number = 0.8,
    significance: number = 0.05
): number {
    // Simplified calculation
    const zAlpha = 1.96; // 95% confidence
    const zBeta = 0.84; // 80% power

    const p1 = baselineRate;
    const p2 = baselineRate * (1 + minimumDetectableEffect);

    const numerator = 2 * Math.pow(zAlpha + zBeta, 2) * p1 * (1 - p1);
    const denominator = Math.pow(p2 - p1, 2);

    if (denominator === 0) return Infinity;

    return Math.ceil(numerator / denominator);
}

/**
 * Determine winner based on results
 */
export function determineWinner(
    variants: Array<{ id: string; conversions: number; visitors: number }>
): { winnerId: string | null; confidence: number; isSignificant: boolean; uplift: number } {
    if (variants.length < 2) {
        return { winnerId: null, confidence: 0, isSignificant: false, uplift: 0 };
    }

    const control = variants[0];
    let bestVariant = control;
    let highestRate = calculateConversionRate(control.conversions, control.visitors);

    for (let i = 1; i < variants.length; i++) {
        const rate = calculateConversionRate(variants[i].conversions, variants[i].visitors);
        if (rate > highestRate) {
            highestRate = rate;
            bestVariant = variants[i];
        }
    }

    const confidence = calculateConfidence(
        control.conversions,
        control.visitors,
        bestVariant.conversions,
        bestVariant.visitors
    );

    const uplift = calculateUplift(
        control.conversions,
        control.visitors,
        bestVariant.conversions,
        bestVariant.visitors
    );

    return {
        winnerId: bestVariant.id,
        confidence: Number(confidence.toFixed(2)),
        isSignificant: isStatisticallySignificant(confidence),
        uplift: Number(uplift.toFixed(2)),
    };
}
