/**
 * ROI Calculations for Page Speed Impact
 *
 * Based on research:
 * - Every 100ms delay reduces conversions by ~1%
 * - Google study: 53% of mobile users abandon sites taking > 3s
 * - Amazon: 100ms latency = 1% sales drop
 */

export interface ROIInputs {
    monthlyTraffic: number;
    averageOrderValue: number;
    conversionRate: number; // as percentage (e.g., 2 = 2%)
    currentLoadTime: number; // in seconds
}

export interface ROIResult {
    currentMonthlyRevenue: number;
    optimalMonthlyRevenue: number;
    monthlyLoss: number;
    yearlyLoss: number;
    lostConversions: number;
    improvementPotential: number; // percentage increase possible
}

export interface ChartDataPoint {
    loadTime: number;
    revenue: number;
    conversionRate: number;
}

/**
 * Calculate conversion rate penalty based on load time
 * Uses exponential decay for a smooth curve
 * Research shows ~7% conversion loss per second of delay after 1s
 */
export function getConversionPenalty(loadTimeSeconds: number): number {
    const OPTIMAL_LOAD_TIME = 1; // seconds
    const DECAY_RATE = 0.12; // Controls curve steepness

    if (loadTimeSeconds <= OPTIMAL_LOAD_TIME) {
        return 0;
    }

    const delaySeconds = loadTimeSeconds - OPTIMAL_LOAD_TIME;
    // Exponential decay: 1 - e^(-k*x) gives smooth curve from 0 to ~0.7
    const penalty = 0.7 * (1 - Math.exp(-DECAY_RATE * delaySeconds));

    return Math.min(penalty, 0.7);
}

/**
 * Calculate adjusted conversion rate based on load time
 */
export function getAdjustedConversionRate(
    baseConversionRate: number,
    loadTimeSeconds: number
): number {
    const penalty = getConversionPenalty(loadTimeSeconds);
    const adjustedRate = baseConversionRate * (1 - penalty);
    return Math.max(adjustedRate, 0);
}

/**
 * Calculate monthly revenue given inputs
 */
export function calculateMonthlyRevenue(
    traffic: number,
    conversionRate: number,
    aov: number
): number {
    return traffic * (conversionRate / 100) * aov;
}

/**
 * Main ROI calculation function
 */
export function calculateROI(inputs: ROIInputs): ROIResult {
    const { monthlyTraffic, averageOrderValue, conversionRate, currentLoadTime } =
        inputs;

    // Optimal scenario (1 second load time)
    const optimalConversionRate = conversionRate;
    const optimalMonthlyRevenue = calculateMonthlyRevenue(
        monthlyTraffic,
        optimalConversionRate,
        averageOrderValue
    );

    // Current scenario with speed penalty
    const currentAdjustedRate = getAdjustedConversionRate(
        conversionRate,
        currentLoadTime
    );
    const currentMonthlyRevenue = calculateMonthlyRevenue(
        monthlyTraffic,
        currentAdjustedRate,
        averageOrderValue
    );

    const monthlyLoss = optimalMonthlyRevenue - currentMonthlyRevenue;
    const yearlyLoss = monthlyLoss * 12;

    // Lost conversions per month
    const optimalConversions = monthlyTraffic * (optimalConversionRate / 100);
    const currentConversions = monthlyTraffic * (currentAdjustedRate / 100);
    const lostConversions = Math.round(optimalConversions - currentConversions);

    // Improvement potential (percentage increase)
    const improvementPotential =
        currentMonthlyRevenue > 0
            ? ((optimalMonthlyRevenue - currentMonthlyRevenue) /
                currentMonthlyRevenue) *
            100
            : 0;

    return {
        currentMonthlyRevenue,
        optimalMonthlyRevenue,
        monthlyLoss,
        yearlyLoss,
        lostConversions,
        improvementPotential,
    };
}

/**
 * Generate chart data showing revenue at different load times
 */
export function generateChartData(inputs: ROIInputs): ChartDataPoint[] {
    const { monthlyTraffic, averageOrderValue, conversionRate } = inputs;
    const dataPoints: ChartDataPoint[] = [];

    // Generate points from 0.5s to 8s in 0.5s increments
    for (let loadTime = 0.5; loadTime <= 8; loadTime += 0.5) {
        const adjustedRate = getAdjustedConversionRate(conversionRate, loadTime);
        const revenue = calculateMonthlyRevenue(
            monthlyTraffic,
            adjustedRate,
            averageOrderValue
        );

        dataPoints.push({
            loadTime,
            revenue: Math.round(revenue),
            conversionRate: adjustedRate,
        });
    }

    return dataPoints;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
}

/**
 * Format large numbers for display
 */
export function formatNumber(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
}
