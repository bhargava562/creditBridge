import { POST } from '../app/api/evaluate/route';
import { NextRequest } from 'next/server';
import sampleProfiles from '../data/sampleProfiles.json';

async function testApi() {
  console.log('--- STARTING API ROUTE /api/evaluate TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Test 1: Declined Consent Gate (consentGranted: false)
  const req1 = new NextRequest('http://localhost:3000/api/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      input: sampleProfiles[0],
      consentGranted: false
    })
  });
  const res1 = await POST(req1);
  const data1 = await res1.json();
  assert(res1.status === 403, 'Declined consent returns 403 Forbidden');
  assert(data1.error === 'CONSENT_DENIED', 'Declined consent returns CONSENT_DENIED error code');

  // Test 2: Invalid input (requestedAmount: 0)
  const req2 = new NextRequest('http://localhost:3000/api/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      input: { ...sampleProfiles[0], requestedAmount: 0 },
      consentGranted: true
    })
  });
  const res2 = await POST(req2);
  const data2 = await res2.json();
  assert(res2.status === 400, 'Invalid loan amount returns 400 Bad Request');

  // Test 3: Happy path evaluation
  const req3 = new NextRequest('http://localhost:3000/api/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      input: sampleProfiles[0],
      consentGranted: true
    })
  });
  const res3 = await POST(req3);
  const data3 = await res3.json();
  assert(res3.status === 200, 'Consented evaluation returns 200 OK');
  assert(data3.success === true, 'Response payload contains success: true');
  assert(data3.isDemoData === true, 'Response payload discloses isDemoData: true');
  assert(data3.cashflow.averageMonthlyInflow > 0, 'Cashflow summary contains valid averageMonthlyInflow');
  assert(data3.schemeCards.length > 0, 'Scheme cards list is populated');
  assert(data3.missingItems.length > 0, 'Missing items checklist is populated');
  assert(typeof data3.disclaimer === 'string', 'Disclaimer is present');

  console.log(`--- API TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

testApi();
