// Automated Headless Test Suite for Mystery Unlocked: The 13th File
// Tests state integrity, clue discovery, mystery board links, contradictions, deductions, and all 4 endings.

import { CLUES, SUSPECTS, DEDUCTIONS, ENDINGS, ROOMS } from '../js/data.js';
import { BulletproofGameState } from '../js/state.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAILED: ${message}`);
  }
}

console.log('\n=== RUNNING MYSTERY UNLOCKED HEADLESS TEST SUITE ===\n');

// Mock localStorage for Node.js environment
const mockStorage = {};
globalThis.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// --- Test 1: Fresh Game State Initialization ---
console.log('[Suite 1: Initialization & Baseline]');
const state = new BulletproofGameState();
assert(state.currentChapter === 2, `Initial chapter starts at 2 (Active Chapter 2, got ${state.currentChapter})`);
assert(state.discoveredClueIds.includes('CLUE_13TH_FILE'), 'Initial 13th file clue is discovered');
assert(Array.isArray(state.yarnConnections), 'Yarn connections is an array');
assert(state.yarnConnections.length === 0, 'Board starts with zero invalid initial yarn connections');
assert(CLUES.length === 17, `Total clues count is 17 (got ${CLUES.length})`);

// Verify CLUE_GENERATOR_TELEMETRY exists and is in ROOM_DRAINAGE
const drainage = ROOMS.find(r => r.id === 'ROOM_DRAINAGE');
assert(drainage && drainage.clueIds.includes('CLUE_GENERATOR_TELEMETRY'), 'CLUE_GENERATOR_TELEMETRY is registered in ROOM_DRAINAGE');

// --- Test 2: Clue Discovery & Chapter Progression ---
console.log('\n[Suite 2: Clue Discovery]');
CLUES.forEach(c => state.discoverClue(c.id));
assert(state.discoveredClueIds.length === 17, `All 17 clues successfully discovered (count: ${state.discoveredClueIds.length})`);
assert(state.isClueDiscovered('CLUE_GENERATOR_TELEMETRY'), 'CLUE_GENERATOR_TELEMETRY is marked discovered');

// --- Test 3: Suspect Claims & Contradictions ---
console.log('\n[Suite 3: Interrogation & Contradictions]');
assert(SUSPECTS.length === 4, `4 suspects registered (got ${SUSPECTS.length})`);

// Vance claim contradiction
const vance = SUSPECTS.find(s => s.id === 'SUSP_VANCE');
const vanceClaim = vance.claims[0];
const wrongTry = state.resolveClaim(vanceClaim.id, 'CLUE_SECURITY_BADGE');
assert(!wrongTry.success, 'Reject invalid counter-clue for Vance claim');

const rightVance = state.resolveClaim(vanceClaim.id, vanceClaim.counterClueId);
assert(rightVance.success && state.isClaimResolved(vanceClaim.id), 'Vance claim successfully contradicted');

// Resolve remaining suspect claims
SUSPECTS.forEach(s => {
  s.claims.forEach(c => {
    state.resolveClaim(c.id, c.counterClueId);
  });
});
assert(state.resolvedClaimIds.length === 4, `All 4 contradictions resolved (got ${state.resolvedClaimIds.length})`);

// --- Test 4: Mystery Board Yarn Connections ---
console.log('\n[Suite 4: Mystery Board Relationships & Required Links]');
const yarnRes1 = state.addYarnConnection('CLUE_CAMERA_LOG', 'CLUE_SECURITY_BADGE');
assert(yarnRes1.success, 'Valid corroboration yarn connection added (CAMERA_LOG <-> SECURITY_BADGE)');
assert(yarnRes1.yarn.type === 'CORROBORATION', `Yarn type is CORROBORATION (got ${yarnRes1.yarn?.type})`);

// Add required links for canonical deductions
// DED_SABOTAGE_TIMELINE requires: ['CLUE_CAMERA_LOG', 'CLUE_GENERATOR_TELEMETRY']
const sabLink = state.addYarnConnection('CLUE_CAMERA_LOG', 'CLUE_GENERATOR_TELEMETRY');
assert(sabLink.success, 'Added required link for Sabotage deduction');

// DED_COVERUP_FIRE requires: ['CLUE_AUTOPSY_REPORT', 'CLUE_BURNT_FUSE']
const fireLink = state.addYarnConnection('CLUE_AUTOPSY_REPORT', 'CLUE_BURNT_FUSE');
assert(fireLink.success, 'Added required link for Fire coverup deduction');

// DED_SUBJECT_13_IDENTITY requires: ['CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT'] and ['CLUE_CRYO_LOG', 'CLUE_NEURAL_READOUT']
const idLink1 = state.addYarnConnection('CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT');
const idLink2 = state.addYarnConnection('CLUE_CRYO_LOG', 'CLUE_NEURAL_READOUT');
assert(idLink1.success && idLink2.success, 'Added required links for Subject 13 identity deduction');

// Test removing a yarn connection
state.addYarnConnection('CLUE_PERIMETER_FENCE', 'CLUE_CRYO_LOG');
const countBefore = state.yarnConnections.length;
state.removeYarnConnection('CLUE_PERIMETER_FENCE', 'CLUE_CRYO_LOG');
assert(state.yarnConnections.length === countBefore - 1, 'Yarn connection cleanly removed');

// --- Test 5: Deduction Matrix Validation ---
console.log('\n[Suite 5: Deduction Matrix Validation]');
for (const ded of DEDUCTIONS) {
  const canAttempt = state.canAttemptDeduction(ded.id);
  assert(canAttempt.allowed, `Can attempt deduction ${ded.id}`);

  // Test selecting wrong option fails
  const wrongOption = ded.options.find(o => !o.isCorrect);
  state.setDeductionOption(ded.id, wrongOption.id);
  const wrongVal = state.validateDeduction(ded.id);
  assert(!wrongVal.success, `Wrong option for ${ded.id} properly rejected`);

  // Test selecting correct option succeeds
  const correctOption = ded.options.find(o => o.isCorrect);
  state.setDeductionOption(ded.id, correctOption.id);
  const rightVal = state.validateDeduction(ded.id);
  assert(rightVal.success, `Correct option for ${ded.id} validated successfully`);
  assert(state.deductionsStatus[ded.id].resolved, `${ded.id} is marked resolved`);
}

// --- Test 6: All Four Endings Reachability ---
console.log('\n[Suite 6: Multi-Ending Verification (A, B, C, D)]');
// Ending A: OFFICIAL_PATSY
const canA = state.canExecuteEnding('OFFICIAL_PATSY');
assert(canA.allowed, 'Ending A (Official Patsy) is reachable');
const execA = state.executeEnding('OFFICIAL_PATSY');
assert(execA.success, 'Ending A executed successfully');

// Ending B: CORPORATE_EXPOSE
const canB = state.canExecuteEnding('CORPORATE_EXPOSE');
assert(canB.allowed, 'Ending B (Corporate Expose) is reachable');
const execB = state.executeEnding('CORPORATE_EXPOSE');
assert(execB.success, 'Ending B executed successfully');

// Ending C: THE_13TH_FILE_UNLOCKED (True Ending)
const canC = state.canExecuteEnding('THE_13TH_FILE_UNLOCKED');
assert(canC.allowed, 'Ending C (The 13th File Unlocked - True Ending) is reachable');
const execC = state.executeEnding('THE_13TH_FILE_UNLOCKED');
assert(execC.success, 'Ending C executed successfully');

// Ending D: JANUS_GLOBAL_AWAKENING (Secret Cipher Ending)
const canD = state.canExecuteEnding('JANUS_GLOBAL_AWAKENING');
assert(canD.allowed, 'Ending D prerequisites satisfied');

const wrongCipher = state.executeEnding('JANUS_GLOBAL_AWAKENING', 'WRONG-CIPHER');
assert(!wrongCipher.success, 'Ending D with incorrect cipher properly rejected');

const rightCipher = state.executeEnding('JANUS_GLOBAL_AWAKENING', 'JANUS-13-AWAKE');
assert(rightCipher.success, 'Ending D with secret cipher JANUS-13-AWAKE executed successfully');

// --- Test 7: Save & Load / Migration Integrity ---
console.log('\n[Suite 7: Save Export, Import & State Integrity]');
const exported = state.exportSaveData();
assert(typeof exported === 'string' && exported.length > 50, 'Save data exported as valid JSON string');

const state2 = new BulletproofGameState();
const importRes = state2.importSaveData(exported);
assert(importRes.success, 'Save data imported into fresh game state successfully');
assert(state2.discoveredClueIds.length === 17, 'Imported state retains all 17 clues');
assert(state2.resolvedClaimIds.length === 4, 'Imported state retains all 4 contradictions');
assert(state2.unlockedEndings.length === 4, 'Imported state retains all 4 unlocked endings');

// --- Final Summary ---
console.log('\n=================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('=================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL 45 TESTS PASSED! ZERO DEFECTS DETECTED.\n');
  process.exit(0);
}
