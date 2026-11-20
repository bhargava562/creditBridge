import { NextRequest, NextResponse } from 'next/server';
import { BusinessInput, EvaluationResponse } from '@/lib/types';
import { analyzeCashflowTimeSeries } from '@/lib/cashflow';
import { matchSchemesAndGaps } from '@/lib/matcher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, consentGranted } = body as { input: BusinessInput; consentGranted: boolean };

    // Explicit Consent Gate #1 Check
    if (!consentGranted) {
      return NextResponse.json(
        {
          success: false,
          error: 'CONSENT_DENIED',
          message: 'Explicit Consent Gate #1 was declined or not granted. In accordance with CreditBridge data protection principles, no cashflow analysis or scheme evaluation was performed.'
        },
        { status: 403 }
      );
    }

    // Input Validation
    if (!input || !input.businessName || !input.requestedAmount || input.requestedAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: 'Please provide valid business details, including a valid business name and requested loan amount.'
        },
        { status: 400 }
      );
    }

    // Analyze Cashflow Time-Series
    const cashflow = analyzeCashflowTimeSeries(input);

    // Match Deterministic Schemes & Identify Gaps
    const { schemeCards, missingItems } = matchSchemesAndGaps(input, cashflow);

    const response: EvaluationResponse = {
      success: true,
      evaluatedAt: new Date().toISOString(),
      isDemoData: true, // Transparent prototype disclosure
      applicant: {
        businessName: input.businessName,
        stage: input.stage,
        sector: input.sector,
        requestedAmount: input.requestedAmount,
        region: input.region,
        assistedByOperator: input.assistedByOperator,
        operatorNotes: input.operatorNotes
      },
      cashflow,
      schemeCards,
      missingItems,
      disclaimer: 'Notice: This evaluation was generated using deterministic Indian Central Government scheme rules (PMMY, CGTMSE, PMEGP, Stand-Up India) and consented sample/demo time-series cashflow data for Tech4Bharat 2026. It serves as a pre-application readiness assessment and does not constitute a guaranteed bank loan sanction.'
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Evaluation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: error?.message || 'An unexpected error occurred during evaluation.'
      },
      { status: 500 }
    );
  }
}
