import { RuleCitation } from './types';

export interface SchemeDefinition {
  id: string;
  name: string;
  category: string;
  tier?: string;
  governingMinistry: string;
  minAmount: number;
  maxAmount: number;
  allowedStages: ('new' | 'existing')[];
  allowedSectors: string[];
  collateralRequired: boolean;
  requiresAuditedFinancials: boolean;
  subsidyOrGuaranteeHighlights: string;
  interestBenefitNote: string;
  applicationChannel: string;
  janSamarthMapped: boolean;
  ruleCitations: RuleCitation[];
  keyPrerequisites: string[];
}

export const SCHEME_DATABASE: SchemeDefinition[] = [
  {
    id: 'mudra-shishu',
    name: 'PM MUDRA Yojana — Shishu Tier',
    category: 'Government Micro-Credit (PMMY)',
    tier: 'Shishu (Up to ₹50,000)',
    governingMinistry: 'Ministry of Finance (DFS) / MUDRA SIDBI',
    minAmount: 10000,
    maxAmount: 50000,
    allowedStages: ['new', 'existing'],
    allowedSectors: ['manufacturing', 'services', 'retail_trading', 'agri_allied', 'handicrafts_textiles'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Zero collateral, zero processing fee for Shishu tier. 100% credit guarantee cover backed by NCGTC.',
    interestBenefitNote: 'Interest capped at MCLR/EBLR + reasonable spread; 2% prompt repayment interest subvention for eligible Shishu borrowers.',
    applicationChannel: 'JanSamarth Portal / Scheduled Commercial Banks / RRBs / MFIs',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Identity & Address proof (Aadhaar / Voter ID)',
      'Bank statement or UPI transaction record for past 3-6 months (if existing unit)',
      'Basic quotation for machinery/equipment or inventory estimation'
    ],
    ruleCitations: [
      {
        ruleTitle: 'Pradhan Mantri Mudra Yojana (PMMY) Operational Guidelines',
        authority: 'Department of Financial Services (DFS), Ministry of Finance, GoI',
        circularRef: 'F.No. 27/01/2015-CP / PMMY Master Circular',
        clauseExcerpt: 'Loans up to ₹50,000 are classified as Shishu. No processing fee, zero collateral or third-party guarantee can be demanded by any lending institution.',
        officialSourceUrl: 'https://www.mudra.org.in'
      },
      {
        ruleTitle: 'Credit Guarantee Fund for Micro Units (CGFMU)',
        authority: 'National Credit Guarantee Trustee Company Ltd (NCGTC)',
        circularRef: 'Notification No. 28/01/2016-NCGTC',
        clauseExcerpt: 'Guarantees 75% to 100% of sanctioned credit facility to eligible micro enterprises under MUDRA without asset encumbrance.',
        officialSourceUrl: 'https://www.ncgtc.in'
      }
    ]
  },
  {
    id: 'mudra-kishore',
    name: 'PM MUDRA Yojana — Kishore Tier',
    category: 'Government Micro-Credit (PMMY)',
    tier: 'Kishore (₹50,001 to ₹5,00,000)',
    governingMinistry: 'Ministry of Finance (DFS) / MUDRA SIDBI',
    minAmount: 50001,
    maxAmount: 500000,
    allowedStages: ['new', 'existing'],
    allowedSectors: ['manufacturing', 'services', 'retail_trading', 'agri_allied', 'handicrafts_textiles'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Collateral-free working capital or machinery loan. Covered under CGFMU guarantee portfolio.',
    interestBenefitNote: 'Competitive repo-linked lending rate (RLLR) typically between 9.15% - 11.5% with zero pre-payment penalty for micro units.',
    applicationChannel: 'JanSamarth Portal / Udyamitra / All Public & Private Sector Banks',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Proof of identity and business address',
      'Udyam Registration Certificate (free via udyamregistration.gov.in)',
      '6 months bank/UPI transaction history showing continuous cashflow',
      'Un-audited balance sheet / sales estimate for existing units'
    ],
    ruleCitations: [
      {
        ruleTitle: 'MUDRA Loan Categorization Clause 3.2',
        authority: 'MUDRA Bank / SIDBI Guidelines',
        circularRef: 'PMMY/Tier-II/Kishore Norms',
        clauseExcerpt: 'Kishore covers credit requirements above ₹50,000 and up to ₹5,00,000 to enable growing micro-enterprises to purchase equipment or operational inventory.',
        officialSourceUrl: 'https://www.mudra.org.in'
      },
      {
        ruleTitle: 'RBI Master Directions on Lending to Micro, Small & Medium Enterprises',
        authority: 'Reserve Bank of India',
        circularRef: 'FIDD.MSME & NFS.BC.No.3/06.02.31/2020-21',
        clauseExcerpt: 'Banks are mandated not to accept collateral security in the case of loans up to ₹10 lakh extended to units in the MSE sector.',
        officialSourceUrl: 'https://rbi.org.in'
      }
    ]
  },
  {
    id: 'mudra-tarun',
    name: 'PM MUDRA Yojana — Tarun Tier',
    category: 'Government Micro-Credit (PMMY)',
    tier: 'Tarun (₹5,00,001 to ₹10,00,000)',
    governingMinistry: 'Ministry of Finance (DFS) / MUDRA SIDBI',
    minAmount: 500001,
    maxAmount: 1000000,
    allowedStages: ['new', 'existing'],
    allowedSectors: ['manufacturing', 'services', 'retail_trading', 'agri_allied', 'handicrafts_textiles'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Collateral-free expansion credit. Backed by CGFMU guarantee coverage up to ₹10 Lakhs.',
    interestBenefitNote: 'Sub-prime risk rating rates through PSU lenders with nominal processing fee capped at 0.50% + GST.',
    applicationChannel: 'JanSamarth Portal / Any Commercial Bank / Udyamitra',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Udyam Registration Certificate',
      'Last 12 months bank current account or continuous UPI statement',
      'Last 1-2 years ITR / GST returns (or self-declared sales book for composite GST)',
      'Estimated project cost and machine quotation'
    ],
    ruleCitations: [
      {
        ruleTitle: 'MUDRA Tarun Scheme Framework',
        authority: 'Department of Financial Services, Govt of India',
        circularRef: 'DFS/Credit/PMMY/2015-16/Vol-IV',
        clauseExcerpt: 'Tarun tier provides credit above ₹5 lakh and up to ₹10 lakh for established micro enterprises requiring scaling capital without pledging immovable property.',
        officialSourceUrl: 'https://www.mudra.org.in'
      },
      {
        ruleTitle: 'Tarun Plus Enhancement Clause (Union Budget 2024-25)',
        authority: 'Ministry of Finance',
        circularRef: 'MoF DFS Notification July 2024',
        clauseExcerpt: 'The MUDRA limit is enhanced from ₹10 lakh to ₹20 lakh under the new Tarun Plus tier for entrepreneurs who have previously availed and successfully repaid Tarun loans.',
        officialSourceUrl: 'https://www.jansamarth.in'
      }
    ]
  },
  {
    id: 'cgtmse-guarantee',
    name: 'CGTMSE Credit Guarantee Scheme for MSEs',
    category: 'Institutional Credit Guarantee',
    tier: 'Collateral-Free Facility (Up to ₹500 Lakhs)',
    governingMinistry: 'Ministry of MSME & SIDBI',
    minAmount: 100000,
    maxAmount: 50000000,
    allowedStages: ['new', 'existing'],
    allowedSectors: ['manufacturing', 'services', 'retail_trading'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Up to 85% default guarantee cover for micro enterprises up to ₹5 Lakhs; 85% for all women-owned enterprises; 75% for general category up to ₹500 Lakhs.',
    interestBenefitNote: 'Guaranteed by trust; lenders waive property collateral. Annual guarantee fee reduced to 0.37% for micro enterprises.',
    applicationChannel: 'Member Lending Institutions (MLIs) / JanSamarth Portal',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Udyam Registration Number is mandatory',
      'Viable business cashflow or project viability report',
      'No history of willful default or NPA classification',
      'KYC of all promoters and pan card of the enterprise'
    ],
    ruleCitations: [
      {
        ruleTitle: 'CGTMSE Operations Circular No. 68/2023-24',
        authority: 'Credit Guarantee Fund Trust for Micro and Small Enterprises',
        circularRef: 'CGTMSE/OPERATIONS/2023-24/104',
        clauseExcerpt: 'Guarantee cover enhanced to 85% for micro enterprises up to ₹5 lakh and 85% for all women entrepreneurs, SC/ST, and ZED-certified MSMEs.',
        officialSourceUrl: 'https://www.cgtmse.in'
      },
      {
        ruleTitle: 'Ministry of MSME Credit Flow Directive',
        authority: 'Ministry of Micro, Small and Medium Enterprises',
        circularRef: 'MSME/P&G/CGTMSE/2023/Part-I',
        clauseExcerpt: 'MLIs must ensure sanctioning of collateral-free credit to viable units on cashflow basis without insisting on mortgage of immovable collateral.',
        officialSourceUrl: 'https://msme.gov.in'
      }
    ]
  },
  {
    id: 'pmegp-subsidy',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: 'Credit-Linked Capital Subsidy',
    tier: 'Greenfield Setup (Up to ₹50 Lakhs)',
    governingMinistry: 'Ministry of MSME (KVIC)',
    minAmount: 100000,
    maxAmount: 5000000,
    allowedStages: ['new'],
    allowedSectors: ['manufacturing', 'services', 'agri_allied', 'handicrafts_textiles'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Government provides 15% to 35% non-refundable Margin Money (Subsidy). Rural special categories (Women, SC/ST, Aspirational) receive 35% subsidy.',
    interestBenefitNote: 'Bank finances 60% to 75% of project cost; promoter brings only 5% (special category) or 10% (general category) own contribution.',
    applicationChannel: 'KVIC e-Portal / JanSamarth Portal',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Project must be a NEW enterprise (greenfield). Existing units not eligible for 1st loan.',
      'Educational qualification: 8th pass mandatory if project > ₹10 Lakhs in manufacturing or > ₹5 Lakhs in service.',
      'Detailed Project Report (DPR) with machine quotes and 3-year cashflow projection.',
      'EDP (Entrepreneurship Development Programme) training certificate before loan disbursement.'
    ],
    ruleCitations: [
      {
        ruleTitle: 'PMEGP Scheme Guidelines 2022-26',
        authority: 'Khadi and Village Industries Commission (KVIC), Ministry of MSME',
        circularRef: 'KVIC/PMEGP/Policy/2022-23/Cir-12',
        clauseExcerpt: 'In rural areas, special category beneficiaries including SC, ST, OBC, Women, Minorities, and Differently Abled receive 35% margin money subsidy on project cost up to ₹50 lakh for manufacturing and ₹20 lakh for services.',
        officialSourceUrl: 'https://www.kviconline.gov.in'
      },
      {
        ruleTitle: 'JanSamarth Unified Scheme Guidelines for PMEGP',
        authority: 'National Portal for Credit Linked Government Schemes (JanSamarth)',
        circularRef: 'JS/PMEGP/VER-3.1',
        clauseExcerpt: 'Only new greenfield micro-units are eligible for first loan tranche. Existing operating units must apply under MUDRA or CGTMSE for working capital expansion.',
        officialSourceUrl: 'https://www.jansamarth.in'
      }
    ]
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India Scheme',
    category: 'Affirmative Enterprise Credit',
    tier: 'Targeted Greenfield (₹10 Lakhs to ₹100 Lakhs)',
    governingMinistry: 'Ministry of Finance (DFS) / SIDBI',
    minAmount: 1000000,
    maxAmount: 10000000,
    allowedStages: ['new'],
    allowedSectors: ['manufacturing', 'services', 'retail_trading', 'agri_allied'],
    collateralRequired: false,
    requiresAuditedFinancials: false,
    subsidyOrGuaranteeHighlights: 'Composite loan (term loan + working capital) between ₹10 Lakhs and ₹1 Crore for at least one SC/ST and at least one Woman borrower per bank branch.',
    interestBenefitNote: 'Lowest applicable rate for that category: MCLR/Base Rate + Tenor Premium + 3% maximum.',
    applicationChannel: 'Stand-Up Mitra Portal / JanSamarth / Commercial Bank Branches',
    janSamarthMapped: true,
    keyPrerequisites: [
      'Enterprise must be a greenfield project (first-time venture).',
      'Promoter must be a Woman or SC/ST entrepreneur. If non-individual enterprise, 51% shareholding & controlling stake must be held by SC/ST and/or woman.',
      'Borrower should not be in default to any bank or financial institution.',
      'Detailed Project Report and Udyam Registration (provisional/active).'
    ],
    ruleCitations: [
      {
        ruleTitle: 'Stand-Up India Operational Directive',
        authority: 'Department of Financial Services, Ministry of Finance',
        circularRef: 'DFS/F.No. 28/01/2016-CP-SUIS',
        clauseExcerpt: 'Mandates every commercial bank branch to extend composite credit between ₹10 lakh and ₹100 lakh to at least one SC/ST and one woman borrower for greenfield ventures.',
        officialSourceUrl: 'https://www.standupmitra.in'
      },
      {
        ruleTitle: 'Margin Money Convergence Norms for Stand-Up India',
        authority: 'SIDBI Stand-Up Mitra Desk',
        circularRef: 'SUIS/SIDBI/POL-2023/15',
        clauseExcerpt: 'Borrower margin contribution reduced to up to 15% when converged with eligible state government subsidy schemes.',
        officialSourceUrl: 'https://www.standupmitra.in'
      }
    ]
  }
];
