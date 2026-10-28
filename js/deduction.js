// Player-Led Deduction Matrix — Fully Data-Driven, Anti-Cheat Prerequisites
// Rewritten to render from DEDUCTIONS data, present genuine player choices, and
// replace alert() with in-page panels. (Phase 1 fix: P1-A, P1-B, P3-C)
import { DEDUCTIONS, ENDINGS, CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

// Map from active deduction tab key → deduction ID
const DEDUCTION_TAB_MAP = {
  SABOTAGE: 'DED_SABOTAGE_TIMELINE',
  COVERUP:  'DED_COVERUP_FIRE',
  IDENTITY: 'DED_SUBJECT_13_IDENTITY'
};

// Map from deduction resolution state → best available ending ID
function computeBestEnding() {
  const s1 = state.deductionsStatus['DED_SABOTAGE_TIMELINE']?.resolved;
  const s2 = state.deductionsStatus['DED_COVERUP_FIRE']?.resolved;
  const s3 = state.deductionsStatus['DED_SUBJECT_13_IDENTITY']?.resolved;
  if (s1 && s2 && s3) return 'THE_13TH_FILE_UNLOCKED';
  if (s1 && s2)       return 'CORPORATE_EXPOSE';
  if (s1)             return 'OFFICIAL_PATSY';
  return null;
}

export class DeductionMatrix {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeTabKey = 'SABOTAGE'; // 'SABOTAGE' | 'COVERUP' | 'IDENTITY'
    this.validationResult = null;   // { success, reason, explanation }
    this.endingResult = null;       // ending object after successful indictment
    this.render();
    this.setupListeners();
  }

  get activeDedId() {
    return DEDUCTION_TAB_MAP[this.activeTabKey];
  }

  render() {
    const activeDed = DEDUCTIONS.find(d => d.id === this.activeDedId);
    const activeStatus = state.deductionsStatus[this.activeDedId] || {};

    // Compute pillar readiness
    const pillars = DEDUCTIONS.map(d => ({
      ...d,
      isResolved: !!state.deductionsStatus[d.id]?.resolved
    }));

    // Determine which tab keys map to which deductions in order
    const tabs = [
      { key: 'SABOTAGE', dedId: 'DED_SABOTAGE_TIMELINE', label: 'PILLAR 1: MISSING HOUR', short: 'Missing Hour' },
      { key: 'COVERUP',  dedId: 'DED_COVERUP_FIRE',      label: 'PILLAR 2: STAGED FIRE',  short: 'Staged Fire' },
      { key: 'IDENTITY', dedId: 'DED_SUBJECT_13_IDENTITY', label: 'PILLAR 3: 13TH IDENTITY', short: '13th Identity' }
    ];

    this.container.innerHTML = `
      <div class="case-study-screen-container">
        <!-- Background Scene -->
        <div class="case-study-background">
          <div class="room-rainy-window-bg"></div>
          <div class="witness-across-desk">
            <div class="witness-figure"></div>
            <div class="desk-lamp-glow"></div>
          </div>
          <div class="background-corkboard-preview">
            <div class="bg-board-center-card">THE 13TH FILE?</div>
            <div class="bg-board-string s1"></div>
            <div class="bg-board-string s2"></div>
            <div class="bg-board-string s3"></div>
          </div>
        </div>

        <div class="case-study-interactive-layer">
          <!-- Left HUD: Deduction pillar tabs + active deduction options -->
          <div class="deduction-left-hud">
            <div class="hud-main-heading">EVIDENTIARY PILLARS:</div>

            <!-- Pillar tab switcher -->
            <div class="deduction-tab-bar" role="tablist" aria-label="Deduction pillars">
              ${tabs.map(t => {
                const resolved = state.deductionsStatus[t.dedId]?.resolved;
                return `
                  <button class="deduction-tab-btn ${this.activeTabKey === t.key ? 'active' : ''} ${resolved ? 'resolved' : ''}"
                          data-tab-key="${t.key}"
                          role="tab"
                          aria-selected="${this.activeTabKey === t.key}"
                          title="${t.label}">
                    ${resolved ? '✓' : '○'} ${t.short}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Active deduction inquiry + radio options -->
            ${activeDed ? `
              <div class="deduction-inquiry-box">
                <div class="inquiry-label">INQUIRY:</div>
                <div class="inquiry-text">${activeDed.inquiry}</div>
              </div>

              <div class="deduction-options-list" role="radiogroup" aria-label="Deduction options for ${activeDed.title}">
                ${activeDed.options.map(opt => {
                  const isSelected = activeStatus.selectedOptionId === opt.id;
                  const isResolved = activeStatus.resolved;
                  const isCorrectAndResolved = isResolved && opt.isCorrect;
                  return `
                    <label class="deduction-option-row ${isSelected ? 'selected' : ''} ${isCorrectAndResolved ? 'correct-revealed' : ''}"
                           data-option-id="${opt.id}"
                           data-ded-id="${activeDed.id}">
                      <input type="radio"
                             name="ded_${activeDed.id}"
                             value="${opt.id}"
                             ${isSelected ? 'checked' : ''}
                             ${isResolved ? 'disabled' : ''}
                             aria-label="${opt.label}">
                      <span class="option-radio-mark">${isSelected ? '◉' : '○'}</span>
                      <span class="option-text">${opt.label}</span>
                      ${isCorrectAndResolved ? '<span class="option-correct-badge">✓ VERIFIED</span>' : ''}
                    </label>
                  `;
                }).join('')}
              </div>

              ${activeStatus.resolved ? `
                <div class="deduction-success-panel">
                  <div class="success-icon">✓</div>
                  <div class="success-label">PILLAR DEDUCTION VERIFIED</div>
                  <div class="success-explanation">${activeDed.explanation}</div>
                </div>
              ` : ''}
            ` : '<div class="inquiry-text">Select a pillar above.</div>'}

            <!-- Validation feedback -->
            ${this.validationResult && !this.validationResult.success ? `
              <div class="prerequisite-error-card" role="alert">
                <div class="prereq-error-title">⚠️ CANNOT VERIFY DEDUCTION:</div>
                <div class="prereq-error-body">${this.validationResult.reason}</div>
              </div>
            ` : ''}

            <!-- Action buttons -->
            <div class="hud-action-footer">
              ${!activeStatus?.resolved ? `
                <button class="btn-test-hypothesis" id="btnTestTheory" aria-label="Test the selected hypothesis against evidence">
                  🔍 Test Hypothesis
                </button>
              ` : ''}
              
              <button class="btn-execute-verdict" id="btnExecuteIndictment"
                      ${computeBestEnding() === null ? 'disabled title="Resolve at least one pillar deduction first"' : ''}>
                ⚖️ Submit Indictment
              </button>

              <!-- Master Cipher Terminal (Secret Ending D) -->
              <div class="secret-cipher-box">
                <span class="cipher-label">MASTER TERMINAL CYPHER:</span>
                <div class="cipher-input-row">
                  <input type="text" id="cipherInput" placeholder="ENTER CODE..." maxlength="20" aria-label="Master override code">
                  <button id="btnSubmitCipher" aria-label="Execute override">OVERRIDE</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Handheld Notebook with dynamic pillar status -->
          <div class="handheld-notebook-container">
            <div class="leather-notebook-wrapper">
              <div class="spiral-binding"></div>
              
              <div class="notebook-page left-page">
                <div class="page-header">FINAL CASE STUDY</div>
                <div class="scribbled-section">
                  <div class="scribble-title">The 13th Person?</div>
                  <div class="scribble-line strikethrough">13 vanished from Substation B</div>
                  <div class="scribble-line">Time: 11:42 PM - Camera disabled</div>
                  <div class="scribble-line">Time: 11:59 PM - Breaker 4B thermite</div>
                  
                  <div class="handwritten-timeline-diagram">
                    <div class="timeline-bar">
                      <span class="timeline-cross c1">✖ 23:42</span>
                      <span class="timeline-cross c2">✖ 00:00</span>
                      <span class="timeline-cross c3">? 00:15</span>
                    </div>
                    <div class="timeline-caption">The 13th timeline • Escape breach culvert</div>
                  </div>

                  <!-- Live pillar status -->
                  <div class="pillars-readiness-box">
                    ${pillars.map(p => `
                      <div class="readiness-item ${p.isResolved ? 'ready' : 'unmet'}">
                        <span>${p.title.replace(/^Deduction \d+: /, '')}</span>
                        <span>${p.isResolved ? '✓ VERIFIED' : 'PENDING'}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div class="notebook-page right-page">
                <div class="page-header-sub">FORENSIC CORROBORATION:</div>
                
                <div class="corroboration-checklist">
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_CAMERA_LOG') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_CAMERA_LOG') ? '✓' : '□'}</span>
                    <span class="check-text">Node 04 severed at 23:42 (Marcus Vance)</span>
                  </div>
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_GENERATOR_TELEMETRY') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_GENERATOR_TELEMETRY') ? '✓' : '□'}</span>
                    <span class="check-text">Substation B: uninterrupted backup power</span>
                  </div>
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_BURNT_FUSE') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_BURNT_FUSE') ? '✓' : '□'}</span>
                    <span class="check-text">Thermite incendiary in Breaker Panel 4B</span>
                  </div>
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_13TH_FILE') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_13TH_FILE') ? '✓' : '□'}</span>
                    <span class="check-text">Dr. Paul Vance 2008 dossier proved forged</span>
                  </div>
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_CRYO_LOG') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_CRYO_LOG') ? '✓' : '□'}</span>
                    <span class="check-text">Pod 13 active brainwaves (Julian Ward)</span>
                  </div>
                  <div class="checklist-item ${state.isClueDiscovered('CLUE_NEURAL_READOUT') ? 'checked' : ''}">
                    <span class="check-box">${state.isClueDiscovered('CLUE_NEURAL_READOUT') ? '✓' : '□'}</span>
                    <span class="check-text">Neural graft trial #44 identity overwrite confirmed</span>
                  </div>
                </div>

                <div class="investigator-ink-conclusion">
                  ${this.getNotebookAnalysisText()}
                </div>

                <!-- Ending preview if indictment ready -->
                ${computeBestEnding() ? `
                  <div class="ending-preview-badge">
                    ${(() => {
                      const eid = computeBestEnding();
                      const e = ENDINGS[eid];
                      return `<span style="color:${e.color}">★ ${e.badge}: ${e.title}</span>`;
                    })()}
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Gloved Hands matching Reference Image 5 -->
            <div class="gloved-hands-holding-notebook">
              <div class="left-glove-grip"></div>
              <div class="right-glove-pen-hand">
                <div class="vintage-metal-pen"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ending modal rendered inline (replaces alert()) -->
        ${this.endingResult ? this.renderEndingInline(this.endingResult) : ''}
      </div>
    `;
  }

  getNotebookAnalysisText() {
    const s1 = state.deductionsStatus['DED_SABOTAGE_TIMELINE']?.resolved;
    const s2 = state.deductionsStatus['DED_COVERUP_FIRE']?.resolved;
    const s3 = state.deductionsStatus['DED_SUBJECT_13_IDENTITY']?.resolved;
    if (s3) return `Current Theory: The 13th file was fabricated. I did not enter Blackwood as an outside detective. I was Test Subject Zero. The 'Julian Ward' detective memory was grafted into my mind.`;
    if (s2) return `Current Theory: The electrical fire was a corporate cover-up ordered by Director Finch to bury Dr. Cruz's whistleblower SOS and incinerate Sub-Level 3.`;
    if (s1) return `Current Theory: Chief Marcus Vance staged the fire using military thermite canisters to conceal the midnight culvert breakout.`;
    return `Begin your investigation. Select a hypothesis for each Pillar and test it with physical evidence.`;
  }

  renderEndingInline(ending) {
    return `
      <div class="ending-inline-overlay" id="endingOverlay" role="dialog" aria-modal="true" aria-labelledby="endingTitle">
        <div class="ending-modal-card" style="border-top: 6px solid ${ending.color};">
          <div class="modal-badge-row">
            <span class="ending-badge" style="background: ${ending.color};">${ending.badge}</span>
          </div>
          <h1 class="ending-title" id="endingTitle">${ending.title}</h1>
          <h3 class="ending-sub">${ending.subtitle}</h3>
          <div class="ending-body-text">
            <pre class="ending-formatted">${ending.description}</pre>
          </div>
          <div class="ending-actions">
            <button class="btn-restart-game" id="btnCloseEndingInline">Return to Investigation Workstation</button>
          </div>
        </div>
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Tab switching
      const tabBtn = e.target.closest('.deduction-tab-btn');
      if (tabBtn) {
        sound.playClick();
        this.activeTabKey = tabBtn.dataset.tabKey;
        this.validationResult = null;
        this.render();
        return;
      }

      // Radio option selection
      const optionRow = e.target.closest('.deduction-option-row');
      if (optionRow && !e.target.closest('input[disabled]')) {
        sound.playClick();
        const optionId = optionRow.dataset.optionId;
        const dedId = optionRow.dataset.dedId;
        if (dedId && optionId) {
          state.setDeductionOption(dedId, optionId);
          this.validationResult = null;
          this.render();
        }
        return;
      }

      // Test Hypothesis button — validates the ACTIVE deduction only
      const btnTest = e.target.closest('#btnTestTheory');
      if (btnTest) {
        sound.playClick();
        const activeDedId = this.activeDedId;
        const result = state.validateDeduction(activeDedId);
        this.validationResult = result;
        if (result.success) {
          sound.playContradictionSuccess();
        }
        this.render();
        return;
      }

      // Execute Indictment — determines ending from resolved deductions
      const btnExec = e.target.closest('#btnExecuteIndictment');
      if (btnExec) {
        sound.playClick();
        const endingId = computeBestEnding();
        if (!endingId) {
          this.validationResult = { success: false, reason: 'Resolve at least one Pillar Deduction before submitting your indictment.' };
          this.render();
          return;
        }
        const result = state.executeEnding(endingId);
        if (result.success) {
          sound.playContradictionSuccess();
          this.endingResult = result.ending;
          this.validationResult = null;
          this.render();
        } else {
          this.validationResult = { success: false, reason: result.error };
          this.render();
        }
        return;
      }

      // Close inline ending overlay
      const btnCloseEnding = e.target.closest('#btnCloseEndingInline');
      if (btnCloseEnding) {
        sound.playClick();
        this.endingResult = null;
        this.render();
        return;
      }

      // Secret Ending D cipher
      const btnCipher = e.target.closest('#btnSubmitCipher');
      if (btnCipher) {
        const input = this.container.querySelector('#cipherInput');
        const code = (input?.value || '').trim().toUpperCase();
        const result = state.executeEnding('JANUS_GLOBAL_AWAKENING', code);
        if (result.success) {
          sound.playContradictionSuccess();
          this.endingResult = result.ending;
          this.validationResult = null;
          this.render();
        } else {
          this.validationResult = { success: false, reason: result.error };
          this.render();
        }
        return;
      }
    });

    // Radio input change (direct input click)
    this.container.addEventListener('change', (e) => {
      const input = e.target.closest('input[type="radio"]');
      if (input) {
        sound.playClick();
        const row = input.closest('.deduction-option-row');
        if (row) {
          const optionId = row.dataset.optionId;
          const dedId = row.dataset.dedId;
          if (dedId && optionId) {
            state.setDeductionOption(dedId, optionId);
            this.validationResult = null;
            this.render();
          }
        }
      }
    });
  }
}
