import { BusinessInput, CashflowSummary, FitStatus, MissingItem, SchemeCardItem } from './types';
import { SCHEME_DATABASE, SchemeDefinition } from './schemes';

export function matchSchemesAndGaps(
  input: BusinessInput,
  cashflow: CashflowSummary
): { schemeCards: SchemeCardItem[]; missingItems: MissingItem[] } {
  const schemeCards: SchemeCardItem[] = [];
  const missingItems: MissingItem[] = [];

  // Evaluate each scheme in the database
  for (const scheme of SCHEME_DATABASE) {
    const card = evaluateSingleScheme(scheme, input, cashflow);
    schemeCards.push(card);
  }

  // Sort scheme cards: likely_fit first, then partial_fit, then not_a_fit
  schemeCards.sort((a, b) => {
    const rank: Record<FitStatus, number> = { likely_fit: 0, partial_fit: 1, not_a_fit: 2 };
    return rank[a.fitStatus] - rank[b.fitStatus];
  });

  // Evaluate missing items / verification gaps
  // 1. Udyam Registration
  if (!input.udyamRegistered) {
    missingItems.push({
      id: 'gap-udyam',
      title: 'Udyam Registration Certificate',
      severity: 'verification_needed',
      badgeLabel: 'High Priority (100% Free)',
      description: 'The business does not have an active Udyam registration number linked. Most central MSME interest concessions and collateral-free mandates require Udyam.',
      affectedSchemes: ['PM MUDRA Yojana', 'CGTMSE Credit Guarantee', 'Stand-Up India'],
      howToResolve: 'Visit the official government portal udyamregistration.gov.in. Registration requires only Aadhaar and PAN, is paperless, instantaneous, and costs zero government fees. Beware of fake commercial fee-charging websites.',
      freeGovtPortalUrl: 'https://udyamregistration.gov.in',
      estimatedResolutionDays: 'Instant (15 minutes)'
    });
  }

  // 2. New unit DPR (Detailed Project Report)
  if (input.stage === 'new') {
    missingItems.push({
      id: 'gap-dpr',
      title: 'Detailed Project Report (DPR) & Equipment Quotes',
      severity: 'verification_needed',
      badgeLabel: 'Required for Sanction',
      description: 'Greenfield project proposals require an itemized breakdown of capital costs (plant, machinery, civil work) and 3-year projected cashflows.',
      affectedSchemes: ["Prime Minister's Employment Generation Programme (PMEGP)", 'Stand-Up India Scheme'],
      howToResolve: 'Download standard pre-approved project profiles free from the KVIC portal (kviconline.gov.in) or MSME-DI office. Attach genuine proforma invoices/quotations from verified equipment suppliers.',
      freeGovtPortalUrl: 'https://www.kviconline.gov.in',
      estimatedResolutionDays: '2 - 4 days'
    });

    missingItems.push({
      id: 'gap-edp-training',
      title: 'Entrepreneurship Development Programme (EDP) Certificate',
      severity: 'recommended',
      badgeLabel: 'Can be done online',
      description: 'PMEGP guidelines require successful completion of EDP training before final loan disbursement (can be completed online after in-principle approval).',
      affectedSchemes: ["Prime Minister's Employment Generation Programme (PMEGP)"],
      howToResolve: 'Complete the free 5 to 10 day online EDP training module through the portal edpsampark.in / RSETI center after initial bank acceptance.',
      freeGovtPortalUrl: 'https://www.edpsampark.in',
      estimatedResolutionDays: '5 - 10 days'
    });
  }

  // 3. Address proof / Operating premise proof
  missingItems.push({
    id: 'gap-premise-proof',
    title: 'Operating Address & Shop Existence Proof',
    severity: 'recommended',
    badgeLabel: 'Pre-Disbursement Check',
    description: 'Verifiable proof that the enterprise operates from the stated location (electricity bill, registered rental agreement, or local municipal trade license).',
    affectedSchemes: ['PM MUDRA Yojana', 'CGTMSE Credit Guarantee', 'PMEGP'],
    howToResolve: 'Ensure the latest 2 months electricity bill or shop lease document carries the exact spelling of the business name and proprietor name as shown on Aadhaar.',
    estimatedResolutionDays: '1 - 2 days'
  });

  return { schemeCards, missingItems };
}

function evaluateSingleScheme(
  scheme: SchemeDefinition,
  input: BusinessInput,
  cashflow: CashflowSummary
): SchemeCardItem {
  const reqAmt = input.requestedAmount;
  let fitStatus: FitStatus = 'likely_fit';
  let fitBadgeText = 'Likely Fit';
  let fitHeadline = 'Strong match with applicant profile';
  let fitReason = '';
  let whyNotReason: string | undefined = undefined;

  // Check stage compatibility
  const stageMatches = scheme.allowedStages.includes(input.stage);
  const amountWithinRange = reqAmt >= scheme.minAmount && reqAmt <= scheme.maxAmount;

  if (scheme.id === 'mudra-shishu') {
    if (reqAmt > scheme.maxAmount) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Amount Exceeds Tier';
      fitHeadline = `Requested amount (₹${reqAmt.toLocaleString('en-IN')}) exceeds Shishu ceiling (₹50,000)`;
      fitReason = 'Shishu is limited to small micro-credit up to ₹50,000. Your request qualifies under MUDRA Kishore or Tarun.';
      whyNotReason = `Statutory tier rule: Under PMMY Guidelines clause 3.1, loans above ₹50,000 must be appraised under Kishore (₹50,001 - ₹5,00,000).`;
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'Optimal Micro-Credit';
      fitHeadline = 'Immediate collateral-free credit with zero processing fee';
      fitReason = `Your requested amount of ₹${reqAmt.toLocaleString('en-IN')} falls comfortably inside the Shishu threshold. Cashflow velocity supports fast approval.`;
    }
  } else if (scheme.id === 'mudra-kishore') {
    if (reqAmt < scheme.minAmount) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Below Kishore Tier';
      fitHeadline = `Requested amount is under ₹50,000 (appraise under Shishu)`;
      fitReason = 'MUDRA Kishore starts at ₹50,001. Shishu tier offers simpler processing with zero fee for your requested ticket size.';
      whyNotReason = 'PMMY guidelines classify amounts under ₹50,000 under Shishu with 100% guarantee cover.';
    } else if (reqAmt > scheme.maxAmount) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Exceeds Kishore Tier';
      fitHeadline = `Requested amount (₹${reqAmt.toLocaleString('en-IN')}) exceeds Kishore ceiling (₹5,00,000)`;
      fitReason = 'For loan amounts between ₹5 Lakhs and ₹10 Lakhs, the enterprise must apply under MUDRA Tarun tier.';
      whyNotReason = 'PMMY Kishore ceiling is strictly ₹5,00,000 as per Department of Financial Services norms.';
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'Prime Recommendation';
      fitHeadline = 'Ideal collateral-free working capital or equipment finance';
      fitReason = `Requested loan of ₹${reqAmt.toLocaleString('en-IN')} matches Kishore limits. Continuous monthly surplus of ₹${cashflow.averageNetCashflow.toLocaleString('en-IN')} demonstrates clear repayment capacity without requiring immovable property.`;
      if (input.womenOwned) {
        fitReason += ' Women entrepreneurs benefit from priority processing and concessional interest spreads under MUDRA nodal banks.';
      }
    }
  } else if (scheme.id === 'mudra-tarun') {
    if (reqAmt < scheme.minAmount) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Below Tarun Tier';
      fitHeadline = `Amount below ₹5,00,001 (appraise under Kishore)`;
      fitReason = 'MUDRA Tarun begins at ₹5,00,001. Your requested amount of ₹' + reqAmt.toLocaleString('en-IN') + ' qualifies under Kishore tier.';
      whyNotReason = 'PMMY categorizes loans under ₹5 Lakhs as Kishore to ensure lower documentation thresholds.';
    } else if (reqAmt > scheme.maxAmount) {
      fitStatus = 'partial_fit';
      fitBadgeText = 'Tarun Plus Check';
      fitHeadline = 'Exceeds standard ₹10 Lakhs (Tarun Plus eligible if prior MUDRA repaid)';
      fitReason = 'Union Budget 2024-25 introduced Tarun Plus (up to ₹20 Lakhs) for entrepreneurs who previously availed and fully repaid Tarun loans.';
      whyNotReason = 'First-time borrowers under Tarun are capped at ₹10,00,000.';
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'High Value Fit';
      fitHeadline = 'Collateral-free scaling credit up to ₹10,00,000';
      fitReason = `Requested amount of ₹${reqAmt.toLocaleString('en-IN')} is within Tarun limits. Operating cashflow of ₹${cashflow.averageMonthlyInflow.toLocaleString('en-IN')}/month supports the proposed expansion.`;
    }
  } else if (scheme.id === 'cgtmse-guarantee') {
    if (reqAmt > 50000000) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Exceeds Ceiling';
      fitHeadline = 'Amount exceeds maximum CGTMSE threshold (₹500 Lakhs)';
      fitReason = 'CGTMSE trust cover extends up to ₹5 Crores.';
      whyNotReason = 'Statutory scheme limit under CGTMSE guidelines.';
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'Government Guarantee';
      fitHeadline = '85% credit guarantee cover — bank cannot insist on land/building';
      fitReason = `Covers your proposed credit facility up to ₹${reqAmt.toLocaleString('en-IN')}. `;
      if (input.womenOwned) {
        fitReason += 'Special benefit: 85% guarantee cover for women-led enterprises with concessional annual guarantee fee (AGF) of 0.37%.';
      } else {
        fitReason += 'Provides up to 85% default guarantee cover for micro-enterprises up to ₹5 Lakhs and 75% for small enterprises.';
      }
    }
  } else if (scheme.id === 'pmegp-subsidy') {
    if (input.stage === 'existing') {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'New Units Only';
      fitHeadline = 'PMEGP 1st loan is restricted exclusively to new greenfield ventures';
      fitReason = 'PMEGP provides capital subsidies for setting up brand-new enterprises. Because your business is already operating, you should utilize MUDRA or CGTMSE for expansion.';
      whyNotReason = 'KVIC PMEGP Scheme Guideline Clause 4.1: Existing units are not eligible for first-time financial assistance under PMEGP.';
    } else if (reqAmt > scheme.maxAmount) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Exceeds Project Cap';
      fitHeadline = 'Requested amount exceeds PMEGP ceiling';
      fitReason = 'Manufacturing project cost ceiling is ₹50 Lakhs and service project cost is ₹20 Lakhs.';
      whyNotReason = 'KVIC statutory ceiling on project size.';
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'High Subsidy Benefit';
      fitHeadline = 'Up to 35% non-refundable government margin money subsidy';
      let subsidyPct = 15;
      if (input.region === 'rural' && (input.womenOwned || input.scStOwned || input.region === 'ner_aspirational')) {
        subsidyPct = 35;
      } else if (input.region === 'rural') {
        subsidyPct = 25;
      } else if (input.womenOwned || input.scStOwned) {
        subsidyPct = 25;
      }
      const estimatedSubsidy = Math.round((reqAmt * subsidyPct) / 100);
      fitReason = `As a ${input.region} greenfield enterprise${input.womenOwned || input.scStOwned ? ' with special category ownership' : ''}, you qualify for approximately ${subsidyPct}% subsidy (~₹${estimatedSubsidy.toLocaleString('en-IN')}). Promoter own contribution is just ${subsidyPct === 35 ? '5%' : '10%'}.`;
    }
  } else if (scheme.id === 'standup-india') {
    if (input.stage === 'existing') {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Greenfield Only';
      fitHeadline = 'Stand-Up India is designated for greenfield (new) ventures only';
      fitReason = 'The scheme is legally framed for first-time ventures promoted by SC/ST or Women entrepreneurs.';
      whyNotReason = 'Stand-Up India Scheme Operational Directive Clause 2: The enterprise must be a greenfield enterprise in manufacturing, services, or trading.';
    } else if (!input.womenOwned && !input.scStOwned) {
      fitStatus = 'not_a_fit';
      fitBadgeText = 'Target Group Check';
      fitHeadline = 'Restricted to SC/ST and/or Women entrepreneurs';
      fitReason = 'Mandated specifically for SC/ST and women founders.';
      whyNotReason = 'Department of Financial Services mandate to promote affirmative entrepreneurship among underrepresented groups.';
    } else if (reqAmt < 1000000) {
      fitStatus = 'partial_fit';
      fitBadgeText = 'Ticket Size Warning';
      fitHeadline = `Stand-Up India begins at ₹10 Lakhs (requested ₹${reqAmt.toLocaleString('en-IN')})`;
      fitReason = 'The statutory minimum loan under Stand-Up India is ₹10,00,000. For lower amounts, PMEGP or MUDRA offers identical or superior terms without ticket constraints.';
      whyNotReason = 'Stand-Up India statutory floor is ₹10,00,000 as per RBI/DFS instructions.';
    } else {
      fitStatus = 'likely_fit';
      fitBadgeText = 'Affirmative Credit Fit';
      fitHeadline = 'Composite credit between ₹10 Lakhs and ₹1 Crore for targeted founders';
      fitReason = `Matches both the affirmative criteria (Women / SC-ST founder) and new greenfield enterprise requirement.`;
    }
  }

  return {
    id: scheme.id,
    schemeName: scheme.name,
    tierOrCategory: scheme.tier || scheme.category,
    governingMinistry: scheme.governingMinistry,
    fitStatus,
    fitBadgeText,
    fitHeadline,
    fitReason,
    whyNotReason,
    maxEligibleAmount: scheme.maxAmount,
    eligibleAmountDisplay: `₹${scheme.minAmount.toLocaleString('en-IN')} to ₹${scheme.maxAmount.toLocaleString('en-IN')}`,
    collateralRequired: scheme.collateralRequired,
    subsidyOrGuaranteeHighlights: scheme.subsidyOrGuaranteeHighlights,
    interestBenefitNote: scheme.interestBenefitNote,
    ruleCitations: scheme.ruleCitations,
    keyPrerequisites: scheme.keyPrerequisites,
    applicationChannel: scheme.applicationChannel,
    janSamarthMapped: scheme.janSamarthMapped
  };
}
