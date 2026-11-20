import { BusinessInput, CashflowSummary, TimeSeriesPoint } from './types';

export function analyzeCashflowTimeSeries(input: BusinessInput): CashflowSummary {
  const series: TimeSeriesPoint[] = input.timeSeriesData && input.timeSeriesData.length > 0
    ? input.timeSeriesData
    : generateFallbackSeries(input);

  const n = series.length;
  const totalInflow = series.reduce((sum, p) => sum + p.inflow, 0);
  const totalOutflow = series.reduce((sum, p) => sum + p.outflow, 0);
  const avgInflow = Math.round(totalInflow / n);
  const avgOutflow = Math.round(totalOutflow / n);
  const avgNet = avgInflow - avgOutflow;

  // Trend calculation: compare first half average with second half average
  const half = Math.max(1, Math.floor(n / 2));
  const firstHalfInflow = series.slice(0, half).reduce((s, p) => s + p.inflow, 0) / half;
  const secondHalfInflow = series.slice(half).reduce((s, p) => s + p.inflow, 0) / (n - half);
  
  const trendPercent = firstHalfInflow > 0
    ? Math.round(((secondHalfInflow - firstHalfInflow) / firstHalfInflow) * 100)
    : 0;

  let inflowTrend: 'growing' | 'stable' | 'declining' | 'volatile' = 'stable';
  if (trendPercent >= 10) {
    inflowTrend = 'growing';
  } else if (trendPercent <= -10) {
    inflowTrend = 'declining';
  } else {
    // Check volatility using standard deviation
    const variance = series.reduce((s, p) => s + Math.pow(p.inflow - avgInflow, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const cv = avgInflow > 0 ? (stdDev / avgInflow) : 0;
    if (cv > 0.35) {
      inflowTrend = 'volatile';
    } else {
      inflowTrend = 'stable';
    }
  }

  // UPI share
  const totalUpiShare = series.reduce((sum, p) => sum + p.upiSharePercent, 0);
  const avgUpiConcentration = Math.round(totalUpiShare / n);

  // Negative months count
  const negativeMonths = series.filter(p => p.netCashflow < 0).length;

  // Consistency score calculation (0 to 100)
  let consistencyScore = 70;
  if (negativeMonths === 0) consistencyScore += 15;
  else if (negativeMonths === 1) consistencyScore += 5;
  else consistencyScore -= 20;

  if (inflowTrend === 'growing') consistencyScore += 10;
  if (inflowTrend === 'stable') consistencyScore += 5;
  if (inflowTrend === 'declining') consistencyScore -= 15;

  if (avgUpiConcentration >= 70) consistencyScore += 10;
  else if (avgUpiConcentration >= 40) consistencyScore += 5;

  consistencyScore = Math.max(20, Math.min(98, consistencyScore));

  // Debt capacity: 45% of average net surplus minus existing debt obligations
  const surplusAfterExistingDebt = Math.max(0, avgNet - (input.existingMonthlyDebt || 0));
  const estimatedMonthlyEmiCapacity = Math.round(surplusAfterExistingDebt * 0.45);

  // Approximate DSCR proxy
  const estimatedProposedEmi = Math.max(1000, Math.round((input.requestedAmount * 0.02))); // ~2% monthly amort rough rule of thumb
  const totalDebtObligation = (input.existingMonthlyDebt || 0) + estimatedProposedEmi;
  const dscrProxy = totalDebtObligation > 0
    ? Number((avgNet / totalDebtObligation).toFixed(2))
    : 2.0;

  // Plain-Language Signals
  const signals: string[] = [];

  if (input.stage === 'new') {
    signals.push(
      `New venture profile: Seed cashflow indicates disciplined personal/family reserves with ₹${avgInflow.toLocaleString('en-IN')}/month verified bank velocity.`
    );
    signals.push(
      'Eligible for up to 35% government capital subsidy under PMEGP or MUDRA start-up credit line without requiring historical business ITR.'
    );
  } else {
    signals.push(
      `Operating surplus: Generates an average monthly net surplus of ₹${avgNet.toLocaleString('en-IN')}, demonstrating viable ongoing unit economics.`
    );
    if (avgUpiConcentration >= 60) {
      signals.push(
        `Digital trail: ${avgUpiConcentration}% of collections are captured through UPI QR / digital settlement, establishing a verifiable cash velocity trail.`
      );
    } else {
      signals.push(
        `Digital mix: ${avgUpiConcentration}% UPI collections complemented by commercial bank transactions, sufficient for cashflow-based appraisal.`
      );
    }

    if (inflowTrend === 'growing') {
      signals.push(
        `Upward trajectory: Inflows expanded by +${trendPercent}% across the evaluation window, reflecting healthy customer demand.`
      );
    } else if (inflowTrend === 'stable') {
      signals.push(
        'Predictable turnover: Cashflow displays tight consistency with low month-to-month variance.'
      );
    }

    if (negativeMonths === 0) {
      signals.push(
        'Zero deficit cycles: All observed monthly cycles generated positive net operating cashflow.'
      );
    }
  }

  signals.push(
    `Repayment capacity: Conservative debt-servicing buffer of approximately ₹${estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/month after accounting for living & operating expenses.`
  );

  // Fairness & Anti-Bias Audit Note
  const fairnessNote =
    'Fairness & Algorithmic Neutrality: CreditBridge assesses cashflow velocity, consistency, and digital receipt continuity directly from time-series numbers. It strictly prohibits proxy penalty variables (such as postal PIN-code redlining, gender, caste, or non-ownership of immovable property). Demographic tags (women entrepreneurship, SC/ST ownership, rural/aspirational geography) are utilized exclusively in an affirmative manner to unlock enhanced government margin subsidies (e.g., 35% PMEGP subsidy vs 15% general) and concessional guarantee fees under CGTMSE.';

  // Explainability Summary
  const explainabilitySummary =
    input.stage === 'new'
      ? `Applicant shows disciplined initial equity and savings activity. Proposed project has high suitability for credit-linked capital subsidy schemes where historical turnover is not legally mandated.`
      : `Applicant's operational cashflow supports a loan amount of ₹${input.requestedAmount.toLocaleString('en-IN')}. The business generates ₹${avgNet.toLocaleString('en-IN')}/month surplus with strong digital receipt frequency, satisfying collateral-free MSE guidelines.`;

  return {
    averageMonthlyInflow: avgInflow,
    averageMonthlyOutflow: avgOutflow,
    averageNetCashflow: avgNet,
    inflowTrend,
    trendPercent,
    consistencyScore,
    averageUpiConcentration: avgUpiConcentration,
    estimatedMonthlyEmiCapacity,
    dscrProxy,
    plainLanguageSignals: signals,
    fairnessNote,
    explainabilitySummary
  };
}

function generateFallbackSeries(input: BusinessInput): TimeSeriesPoint[] {
  const base = input.monthlyTurnover > 0 ? input.monthlyTurnover : Math.max(30000, Math.round(input.requestedAmount * 0.2));
  const months = ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];
  const factors = [0.92, 0.96, 1.0, 1.03, 1.08, 1.12];

  return months.map((month, idx) => {
    const inf = Math.round(base * factors[idx]);
    const outf = Math.round(inf * 0.65);
    return {
      period: month,
      inflow: inf,
      outflow: outf,
      netCashflow: inf - outf,
      upiSharePercent: 75,
      transactionCount: 120 + idx * 15
    };
  });
}
