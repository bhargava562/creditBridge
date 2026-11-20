# CreditBridge — End-to-End User Journey & Edge Case Handling

## 1. Persona Profiles

CreditBridge is designed to serve two primary user personas:

### Persona A: Direct Self-Service MSME Entrepreneur
* **Example:** Ramesh Kumar, proprietor of an engineering workshop in Bengaluru.
* **Tech Literacy:** Smartphone user, uses UPI QR daily, files GST returns, seeks rapid collateral-free expansion credit under MUDRA Tarun.
* **Key Need:** Clear, instant comparison of scheme rules without wading through government PDF jargon.

### Persona B: Assisted Operator Session (JanAI Café / Banking Correspondent / SHG Sahayak)
* **Example:** Sunita Devi (SHG Bank Sakhi) assisting Priya (tailor in Solapur).
* **Context:** Low-literacy borrower, vernacular language, reliant on digital UPI QR sales.
* **Key Need:** Voice-assisted prefill, plain-language signals, structured operator note tracking, and a strictly enforced borrower sign-off gate so the operator cannot submit without the borrower's informed consent.

---

## 2. The 4-Step User Journey

```text
+------------------+     +--------------------+     +-------------------+     +--------------------+
|  Step 1: Intake  | --> |  Step 2: Consent   | --> |   Step 3: Feed    | --> |  Step 4: Approval  |
|  (/)             |     |  (/consent)        |     |   (/feed)         |     |  (/approve)        |
+------------------+     +--------------------+     +-------------------+     +--------------------+
Minimal parameters,      Explicit Consent     Rule-cited cards,         Borrower sign-off,
representative presets,  Gate #1: Allow       time-series chart,        printable readiness
assisted mode toggle     vs Decline & Stop    missing-item gaps         summary certificate
```

### Step 1: Minimal Intake (`/`)
* **Actions:**
  * User can choose one of 3 realistic Indian MSME presets (Boutique, Fabrication, Dairy Farm) or enter custom inputs.
  * Inputs include business stage (new vs existing), sector, requested amount, turnover, region, affirmative checkboxes (women-owned, SC/ST, Udyam).
  * Optional voice audio prompt simulator allows testing natural-language vernacular prompts (e.g., Hindi/Marathi tailoring shop query).
  * Assisted Operator toggle opens fields for Operator Name and Ground Notes.
* **Outcome:** Parameters saved to `sessionStorage`. User proceeds to Consent Gate #1.

### Step 2: Explicit Consent Gate #1 (`/consent`)
* **Actions:**
  * Plain-language explanation of what data will be read (inflow velocity, UPI frequency, debt buffer) and what will **never** happen (no credit bureau hit, no broker lead selling, no formal bank inquiry without approval).
  * Two unambiguous choices:
    1. **"Allow & Analyze Cashflow (Consent Granted)"** -> Invokes `POST /api/evaluate`, navigates to `/feed`.
    2. **"Decline & Stop Session"** -> Aborts immediately, displays clean session stopped message with zero records saved.

### Step 3: Recommendation Feed & Cashflow Trend (`/feed`)
* **Actions:**
  * **Cashflow Card:** Displays 6-month continuous cash movement chart, consistency score ($0-100$), UPI share, EMI service buffer, and plain-language signals.
  * **Scheme Recommendation Cards:** Filtered and sorted into *Likely Fit*, *Check Rule*, and *Not a Fit*. Each card features an expandable **Statutory Source Citations** drawer containing DFS/KVIC circular excerpts and links to official portals.
  * **Missing Items Card:** Displays only true verification gaps (e.g., missing Udyam registration, DPR requirement) with step-by-step instructions on how to resolve them freely without agents or fees.
  * User selects their preferred scheme card and clicks "Proceed to Final Sign-Off".

### Step 4: Approval Gate #2 & Final Readiness Summary (`/approve`)
* **Actions:**
  * Summarizes selected scheme, verified cashflow velocity, and remaining checklist items.
  * **Mandatory Sign-Off Declaration:** Applicant must check the digital authorization box to certify review.
  * **Generated Readiness Summary:** Instant presentation of the official CreditBridge Pre-Application Readiness Summary certificate.
  * Features **Print / Save PDF** (with custom `@media print` styling) and **Copy Summary Text** for submission to bank managers or JanSamarth portal.

---

## 3. Edge Cases & System Handling Matrix

| Scenario / Edge Case | System Behavior & Mitigation |
| :--- | :--- |
| **Applicant declines Consent Gate #1** | Cashflow analysis halts immediately; UI displays a calm confirmation that zero financial records were inspected or saved, with a one-click return to intake. |
| **Existing enterprise applies for PMEGP** | Scheme card is flagged as **Not a Fit** with a clear explanation: *KVIC PMEGP 1st loan is restricted exclusively to new greenfield units*. Guides user to MUDRA or CGTMSE instead. |
| **Applicant requests ₹3.5 Lakhs under MUDRA Shishu** | Shishu card is marked **Not a Fit (Amount Exceeds Tier)** citing PMMY Clause 3.1, while MUDRA Kishore is highlighted as the primary recommendation. |
| **Missing Udyam Registration** | Flagged under Missing Items with direct link to `udyamregistration.gov.in`, highlighting that registration is instant, paperless, and 100% free by law. |
| **Direct navigation to `/feed` or `/approve` without session state** | Clean fallback automatically restores the default verified sample profile and loads evaluation data without crashing. |
| **User prefers reduced motion (`prefers-reduced-motion`)** | CSS animations and transitions are automatically disabled to prevent motion sensitivity. |
| **Assisted Operator completes intake without borrower presence** | Approval Gate #2 enforces direct borrower declaration. The operator's ground notes are preserved in the audit trail, but the borrower remains the sole authorizing signatory. |
