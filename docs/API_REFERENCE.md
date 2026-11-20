# CreditBridge — API Reference (`/api/evaluate`)

## 1. Endpoint Overview

* **Route:** `POST /api/evaluate`
* **Content-Type:** `application/json`
* **Description:** Evaluates an MSME applicant's cashflow time-series data and deterministically matches central government schemes with statutory citations and gap analysis.
* **Authentication:** Ephemeral session / Consented request model.

---

## 2. Request Payload Schema

```typescript
interface EvaluationRequest {
  input: BusinessInput;
  consentGranted: boolean; // MANDATORY: Must be true
}

interface BusinessInput {
  id?: string;
  businessName: string;
  stage: 'new' | 'existing';
  sector: 'manufacturing' | 'services' | 'retail_trading' | 'agri_allied' | 'handicrafts_textiles';
  requestedAmount: number; // in INR
  monthlyTurnover: number; // in INR
  yearsInOperation: number;
  region: 'rural' | 'semi_urban' | 'urban' | 'ner_aspirational';
  womenOwned: boolean;
  scStOwned: boolean;
  udyamRegistered: boolean;
  udyamNumber?: string;
  hasAuditedFinancials: boolean;
  hasPropertyCollateral: boolean;
  existingMonthlyDebt: number; // in INR
  timeSeriesData: TimeSeriesPoint[];
  assistedByOperator: boolean;
  operatorName?: string;
  operatorNotes?: string;
}

interface TimeSeriesPoint {
  period: string;          // e.g. "May 2026"
  inflow: number;          // in INR
  outflow: number;         // in INR
  netCashflow: number;     // in INR
  upiSharePercent: number; // 0 to 100
  transactionCount: number;
}
```

### Example Request Body

```json
{
  "consentGranted": true,
  "input": {
    "businessName": "Priya's Boutique & Tailoring Works",
    "stage": "existing",
    "sector": "handicrafts_textiles",
    "requestedAmount": 350000,
    "monthlyTurnover": 95000,
    "yearsInOperation": 4,
    "region": "semi_urban",
    "womenOwned": true,
    "scStOwned": false,
    "udyamRegistered": false,
    "hasAuditedFinancials": false,
    "hasPropertyCollateral": false,
    "existingMonthlyDebt": 3000,
    "assistedByOperator": true,
    "operatorName": "Sunita Devi (SHG Bank Sakhi, Solapur)",
    "operatorNotes": "Boutique operates near Solapur market yard. Strong UPI QR collections.",
    "timeSeriesData": [
      {
        "period": "May 2026",
        "inflow": 82000,
        "outflow": 52000,
        "netCashflow": 30000,
        "upiSharePercent": 76,
        "transactionCount": 142
      },
      {
        "period": "Jun 2026",
        "inflow": 89000,
        "outflow": 55000,
        "netCashflow": 34000,
        "upiSharePercent": 79,
        "transactionCount": 160
      }
    ]
  }
}
```

---

## 3. Response Payload Schema (HTTP 200 OK)

```typescript
interface EvaluationResponse {
  success: boolean;
  evaluatedAt: string; // ISO 8601 timestamp
  isDemoData: boolean; // Discloses sample/demo mode
  applicant: {
    businessName: string;
    stage: 'new' | 'existing';
    sector: string;
    requestedAmount: number;
    region: string;
    assistedByOperator: boolean;
    operatorNotes?: string;
  };
  cashflow: CashflowSummary;
  schemeCards: SchemeCardItem[];
  missingItems: MissingItem[];
  disclaimer: string;
}
```

### CashflowSummary Object

```json
{
  "averageMonthlyInflow": 97167,
  "averageMonthlyOutflow": 59333,
  "averageNetCashflow": 37834,
  "inflowTrend": "growing",
  "trendPercent": 18,
  "consistencyScore": 95,
  "averageUpiConcentration": 82,
  "estimatedMonthlyEmiCapacity": 15675,
  "dscrProxy": 3.78,
  "plainLanguageSignals": [
    "Operating surplus: Generates an average monthly net surplus of ₹37,834, demonstrating viable ongoing unit economics.",
    "Digital trail: 82% of collections are captured through UPI QR / digital settlement, establishing a verifiable cash velocity trail.",
    "Upward trajectory: Inflows expanded by +18% across the evaluation window, reflecting healthy customer demand.",
    "Zero deficit cycles: All observed monthly cycles generated positive net operating cashflow.",
    "Repayment capacity: Conservative debt-servicing buffer of approximately ₹15,675/month after accounting for living & operating expenses."
  ],
  "fairnessNote": "Fairness & Algorithmic Neutrality: CreditBridge assesses cashflow velocity, consistency, and digital receipt continuity directly from time-series numbers...",
  "explainabilitySummary": "Applicant's operational cashflow supports a loan amount of ₹3,50,000..."
}
```

---

## 4. Error Responses

### 4.1. Consent Declined or Missing (HTTP 403 Forbidden)

Returned whenever `consentGranted` is `false` or missing:

```json
{
  "success": false,
  "error": "CONSENT_DENIED",
  "message": "Explicit Consent Gate #1 was declined or not granted. In accordance with CreditBridge data protection principles, no cashflow analysis or scheme evaluation was performed."
}
```

### 4.2. Invalid Input (HTTP 400 Bad Request)

Returned when required fields (e.g. `businessName`, `requestedAmount <= 0`) are missing:

```json
{
  "success": false,
  "error": "INVALID_INPUT",
  "message": "Please provide valid business details, including a valid business name and requested loan amount."
}
```

### 4.3. Internal Server Error (HTTP 500)

```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "An unexpected error occurred during evaluation."
}
```
