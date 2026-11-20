export type BusinessStage = 'new' | 'existing';
export type BusinessSector = 'manufacturing' | 'services' | 'retail_trading' | 'agri_allied' | 'handicrafts_textiles';
export type RegionType = 'rural' | 'semi_urban' | 'urban' | 'ner_aspirational';
export type FitStatus = 'likely_fit' | 'partial_fit' | 'not_a_fit';
export type MissingItemSeverity = 'critical' | 'verification_needed' | 'recommended';

export interface TimeSeriesPoint {
  period: string; // e.g. "Jun 2026", "Jul 2026"
  inflow: number; // in INR
  outflow: number; // in INR
  netCashflow: number; // in INR
  upiSharePercent: number; // 0 to 100
  transactionCount: number;
}

export interface BusinessInput {
  id?: string;
  businessName: string;
  stage: BusinessStage;
  sector: BusinessSector;
  requestedAmount: number; // in INR
  monthlyTurnover: number; // in INR
  yearsInOperation: number;
  region: RegionType;
  womenOwned: boolean;
  scStOwned: boolean;
  udyamRegistered: boolean;
  udyamNumber?: string;
  hasAuditedFinancials: boolean;
  hasPropertyCollateral: boolean;
  existingMonthlyDebt: number; // existing EMI in INR
  timeSeriesData: TimeSeriesPoint[];
  assistedByOperator: boolean;
  operatorName?: string;
  operatorNotes?: string;
}

export interface CashflowSummary {
  averageMonthlyInflow: number;
  averageMonthlyOutflow: number;
  averageNetCashflow: number;
  inflowTrend: 'growing' | 'stable' | 'declining' | 'volatile';
  trendPercent: number; // e.g. +8.5%
  consistencyScore: number; // 0 to 100
  averageUpiConcentration: number; // 0 to 100%
  estimatedMonthlyEmiCapacity: number; // conservative disposable cashflow
  dscrProxy: number; // Debt Service Coverage Ratio proxy
  plainLanguageSignals: string[];
  fairnessNote: string;
  explainabilitySummary: string;
}

export interface RuleCitation {
  ruleTitle: string;
  authority: string;
  circularRef: string;
  clauseExcerpt: string;
  officialSourceUrl: string;
}

export interface SchemeCardItem {
  id: string;
  schemeName: string;
  tierOrCategory: string;
  governingMinistry: string;
  fitStatus: FitStatus;
  fitBadgeText: string;
  fitHeadline: string;
  fitReason: string;
  whyNotReason?: string;
  maxEligibleAmount: number;
  eligibleAmountDisplay: string;
  collateralRequired: boolean;
  subsidyOrGuaranteeHighlights: string;
  interestBenefitNote: string;
  ruleCitations: RuleCitation[];
  keyPrerequisites: string[];
  applicationChannel: string;
  janSamarthMapped: boolean;
}

export interface MissingItem {
  id: string;
  title: string;
  severity: MissingItemSeverity;
  badgeLabel: string;
  description: string;
  affectedSchemes: string[];
  howToResolve: string;
  freeGovtPortalUrl?: string;
  estimatedResolutionDays: string;
}

export interface EvaluationResponse {
  success: boolean;
  evaluatedAt: string;
  isDemoData: boolean;
  applicant: {
    businessName: string;
    stage: BusinessStage;
    sector: BusinessSector;
    requestedAmount: number;
    region: RegionType;
    assistedByOperator: boolean;
    operatorNotes?: string;
  };
  cashflow: CashflowSummary;
  schemeCards: SchemeCardItem[];
  missingItems: MissingItem[];
  disclaimer: string;
}

export interface ApprovalRecord {
  applicantName: string;
  selectedSchemeId: string;
  selectedSchemeName: string;
  requestedAmount: number;
  consentGranted: boolean;
  approvedByUser: boolean;
  approvedAt: string;
  assistedByOperator: boolean;
  operatorNotes?: string;
  readinessSummaryText: string;
}
