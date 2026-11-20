import { analyzeCashflowTimeSeries } from '../lib/cashflow';
import { matchSchemesAndGaps } from '../lib/matcher';
import sampleProfiles from '../data/sampleProfiles.json';
import { BusinessInput } from '../lib/types';

function runAssertions() {
  console.log('--- STARTING CREDITBRIDGE ENGINE TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean | undefined | null, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  const profiles = sampleProfiles as BusinessInput[];

  // Test 1: Profile 1 (Priya's Boutique - Solapur)
  const p1 = profiles[0];
  const cf1 = analyzeCashflowTimeSeries(p1);
  const match1 = matchSchemesAndGaps(p1, cf1);

  assert(cf1.averageMonthlyInflow > 90000, 'Profile 1 average inflow calculated correctly (>90k)');
  assert(cf1.averageUpiConcentration > 75, 'Profile 1 has strong UPI concentration (>75%)');
  assert(cf1.consistencyScore >= 80, 'Profile 1 has high consistency score');
  
  const p1Kishore = match1.schemeCards.find(s => s.id === 'mudra-kishore');
  assert(p1Kishore && p1Kishore.fitStatus === 'likely_fit', 'Profile 1 qualifies for MUDRA Kishore');

  const p1Shishu = match1.schemeCards.find(s => s.id === 'mudra-shishu');
  assert(p1Shishu && p1Shishu.fitStatus === 'not_a_fit', 'Profile 1 exceeds MUDRA Shishu threshold (correctly marked not_a_fit)');

  const p1UdyamGap = match1.missingItems.find(m => m.id === 'gap-udyam');
  assert(p1UdyamGap !== undefined, 'Profile 1 correctly flags missing Udyam registration');

  // Test 2: Profile 2 (Kumar Metal Fabrication - Bengaluru)
  const p2 = profiles[1];
  const cf2 = analyzeCashflowTimeSeries(p2);
  const match2 = matchSchemesAndGaps(p2, cf2);

  const p2Tarun = match2.schemeCards.find(s => s.id === 'mudra-tarun');
  assert(p2Tarun && p2Tarun.fitStatus === 'likely_fit', 'Profile 2 qualifies for MUDRA Tarun (₹8.5 Lakhs)');

  const p2Pmegp = match2.schemeCards.find(s => s.id === 'pmegp-subsidy');
  assert(p2Pmegp && p2Pmegp.fitStatus === 'not_a_fit', 'Profile 2 correctly rejected from PMEGP 1st loan because unit is existing');

  const p2UdyamGap = match2.missingItems.find(m => m.id === 'gap-udyam');
  assert(p2UdyamGap === undefined, 'Profile 2 already has Udyam, so no Udyam gap is flagged');

  // Test 3: Profile 3 (Aarav Dairy - Muzaffarpur)
  const p3 = profiles[2];
  const cf3 = analyzeCashflowTimeSeries(p3);
  const match3 = matchSchemesAndGaps(p3, cf3);

  const p3Pmegp = match3.schemeCards.find(s => s.id === 'pmegp-subsidy');
  assert(p3Pmegp && p3Pmegp.fitStatus === 'likely_fit', 'Profile 3 qualifies for PMEGP rural new enterprise subsidy');
  assert(p3Pmegp && p3Pmegp.fitReason.includes('35%'), 'Profile 3 gets 35% margin money subsidy (rural + SC category)');

  const p3DprGap = match3.missingItems.find(m => m.id === 'gap-dpr');
  assert(p3DprGap !== undefined, 'Profile 3 flags DPR / Project profile requirement for greenfield');

  // Test 4: Statutory citations validation
  const allCards = [...match1.schemeCards, ...match2.schemeCards, ...match3.schemeCards];
  const cardsWithCitations = allCards.filter(c => c.ruleCitations && c.ruleCitations.length > 0);
  assert(cardsWithCitations.length === allCards.length, '100% of scheme cards have explicit statutory rule citations');

  console.log(`--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runAssertions();
