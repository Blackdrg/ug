// Player-Led Deduction Matrix & Final Case Study Journal with Anti-Cheat Prerequisite Validation
import { DEDUCTIONS, ENDINGS, CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class DeductionMatrix {
  constructor(containerEl, onTriggerEnding) {
    this.container = containerEl;
    this.onTriggerEnding = onTriggerEnding;
    this.activeDeductionKey = 'COVER_UP'; // 'COVER_UP' | 'FIRE_STAGED' | 'I_AM_THE_13TH'
    this.feedback = {};
    this.prerequisiteError = null;

    this.render();
    this.setupListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="case-study-screen-container">
        <!-- Background Scene: Interrogation Room & Witness matching Reference Image 5 -->
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
          <!-- Left HUD: The Deduction Selection Matrix matching Reference Image 5 -->
          <div class="deduction-left-hud">
            <div class="hud-main-heading">THE DEDUCTION:</div>

            <div class="deduction-choice-group">
              <!-- Choice 1: The 13th File Was a Cover-Up -->
              <div class="deduction-choice-item ${this.activeDeductionKey === 'COVER_UP' ? 'selected' : ''}" data-ded-key="COVER_UP" tabindex="0" role="radio" aria-checked="${this.activeDeductionKey === 'COVER_UP'}">
                <div class="choice-checkbox">[ ${this.activeDeductionKey === 'COVER_UP' ? 'X' : ' '} ]</div>
                <div class="choice-text-block">
                  <div class="choice-title">THE 13TH FILE WAS A COVER-UP:</div>
                  <div class="choice-sub">Expose the facility's illegal research and Dr. Finch's unconsented human trials.</div>
                </div>
              </div>

              <!-- Choice 2: The Fire Was Staged -->
              <div class="deduction-choice-item ${this.activeDeductionKey === 'FIRE_STAGED' ? 'selected' : ''}" data-ded-key="FIRE_STAGED" tabindex="0" role="radio" aria-checked="${this.activeDeductionKey === 'FIRE_STAGED'}">
                <div class="choice-checkbox">[ ${this.activeDeductionKey === 'FIRE_STAGED' ? 'X' : ' '} ]</div>
                <div class="choice-text-block">
                  <div class="choice-title">THE FIRE WAS STAGED:</div>
                  <div class="choice-sub">Trust the missing survivors, expose Chief Vance's arson, and seal the evidence.</div>
                </div>
              </div>

              <!-- Choice 3: I Am The 13th (TRUE IDENTITY) -->
              <div class="deduction-choice-item ${this.activeDeductionKey === 'I_AM_THE_13TH' ? 'selected' : ''}" data-ded-key="I_AM_THE_13TH" tabindex="0" role="radio" aria-checked="${this.activeDeductionKey === 'I_AM_THE_13TH'}">
                <div class="choice-checkbox">[ ${this.activeDeductionKey === 'I_AM_THE_13TH' ? 'X' : ' '} ]</div>
                <div class="choice-text-block">
                  <div class="choice-title">I AM THE 13TH:</div>
                  <div class="choice-sub">Confront the realization of your own fabricated identity. You were Subject Zero.</div>
                </div>
              </div>
            </div>

            ${this.prerequisiteError ? `
              <div class="prerequisite-error-card" role="alert">
                <div class="prereq-error-title">⚠️ MISSING CASE PREREQUISITES:</div>
                <div class="prereq-error-body">${this.prerequisiteError}</div>
              </div>
            ` : ''}

            <!-- Validation Action Button with strict anti-cheat check -->
            <div class="hud-action-footer">
              <button class="btn-execute-verdict" id="btnExecuteIndictment">
                ⚖️ Execute Case Indictment & Reveal Ending
              </button>

              <!-- Master Cipher Terminal -->
              <div class="secret-cipher-box">
                <span class="cipher-label">MASTER TERMINAL CYPHER:</span>
                <div class="cipher-input-row">
                  <input type="text" id="cipherInput" placeholder="ENTER 12-CHAR CODE..." maxlength="20" aria-label="Master override code">
                  <button id="btnSubmitCipher" aria-label="Execute override">OVERRIDE</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Center/Right: Handheld Leather 'FINAL CASE STUDY' Notebook held in gloved hands matching Image 5 -->
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
                  
                  <!-- Timeline axis diagram matching Image 5 -->
                  <div class="handwritten-timeline-diagram">
                    <div class="timeline-bar">
                      <span class="timeline-cross c1">✖ 23:42</span>
                      <span class="timeline-cross c2">✖ 00:00</span>
                      <span class="timeline-cross c3">? 00:15</span>
                    </div>
                    <div class="timeline-caption">The 13th timeline &bull; Escape breach culvert</div>
                  </div>

                  <div class="scribbled-note">
                    <span class="arrow-marker">↳</span> "Crown missing investigation transferred on the mystery post regime!"
                  </div>

                  <!-- Pillar Status Readiness Badges (Priority 1 & 2) -->
                  <div class="pillars-readiness-box">
                    <div class="readiness-item ${state.deductionsStatus['DED_SABOTAGE_TIMELINE']?.resolved ? 'ready' : 'unmet'}">
                      <span>Pillar 1: Sabotage Timeline</span>
                      <span>${state.deductionsStatus['DED_SABOTAGE_TIMELINE']?.resolved ? '✓ VERIFIED' : 'PENDING'}</span>
                    </div>
                    <div class="readiness-item ${state.deductionsStatus['DED_COVERUP_FIRE']?.resolved ? 'ready' : 'unmet'}">
                      <span>Pillar 2: Fire Cover-Up</span>
                      <span>${state.deductionsStatus['DED_COVERUP_FIRE']?.resolved ? '✓ VERIFIED' : 'PENDING'}</span>
                    </div>
                    <div class="readiness-item ${state.deductionsStatus['DED_SUBJECT_13_IDENTITY']?.resolved ? 'ready' : 'unmet'}">
                      <span>Pillar 3: Subject 13 Identity</span>
                      <span>${state.deductionsStatus['DED_SUBJECT_13_IDENTITY']?.resolved ? '✓ VERIFIED' : 'PENDING'}</span>
                    </div>
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
                </div>

                <div class="investigator-ink-conclusion">
                  ${this.getNotebookAnalysisText()}
                </div>

                <div class="notebook-actions-row">
                  <button class="btn-notebook-test" id="btnTestTheory">
                    🔍 Test Hypothesis Consistency
                  </button>
                </div>
              </div>
            </div>

            <!-- Gloved Hands holding the notebook matching Reference Image 5 -->
            <div class="gloved-hands-holding-notebook">
              <div class="left-glove-grip"></div>
              <div class="right-glove-pen-hand">
                <div class="vintage-metal-pen"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getNotebookAnalysisText() {
    if (this.activeDeductionKey === 'COVER_UP') {
      return `Current Theory: The electrical fire was a corporate cover-up ordered by Director Finch to bury Dr. Cruz's whistleblower SOS and incinerate Sub-Level 3.`;
    } else if (this.activeDeductionKey === 'FIRE_STAGED') {
      return `Current Theory: Chief Marcus Vance staged the fire using military thermite canisters to conceal the midnight culvert breakout.`;
    } else {
      return `Current Theory: The 13th file was fabricated. I did not enter Blackwood as an outside detective. I was Test Subject Zero. The 'Julian Ward' detective memory was grafted into my mind.`;
    }
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Toggle Deduction Choice
      const choiceItem = e.target.closest('.deduction-choice-item');
      if (choiceItem) {
        sound.playClick();
        this.activeDeductionKey = choiceItem.dataset.dedKey;
        this.prerequisiteError = null;
        this.render();
        return;
      }

      // Test Hypothesis Consistency button
      const btnTest = e.target.closest('#btnTestTheory');
      if (btnTest) {
        sound.playClick();
        let targetDedId = 'DED_SABOTAGE_TIMELINE';
        if (this.activeDeductionKey === 'COVER_UP') targetDedId = 'DED_COVERUP_FIRE';
        if (this.activeDeductionKey === 'I_AM_THE_13TH') targetDedId = 'DED_SUBJECT_13_IDENTITY';

        // Auto select the correct option if the player selected this theory
        const targetDed = DEDUCTIONS.find(d => d.id === targetDedId);
        const correctOpt = targetDed?.options.find(o => o.isCorrect);
        if (correctOpt) {
          state.setDeductionOption(targetDedId, correctOpt.id);
        }

        const result = state.validateDeduction(targetDedId);
        if (result.success) {
          sound.playContradictionSuccess();
          this.prerequisiteError = null;
          alert(`✓ Hypothesis Validated: ${result.explanation}`);
        } else {
          sound.playClick();
          this.prerequisiteError = result.reason;
        }
        this.render();
        return;
      }

      // Execute Indictment & Trigger Ending (Strict Prerequisite Verification)
      const btnExec = e.target.closest('#btnExecuteIndictment');
      if (btnExec) {
        let endingId = 'CORPORATE_EXPOSE';
        if (this.activeDeductionKey === 'FIRE_STAGED') endingId = 'OFFICIAL_PATSY';
        if (this.activeDeductionKey === 'I_AM_THE_13TH') endingId = 'THE_13TH_FILE_UNLOCKED';

        const result = state.executeEnding(endingId);
        if (result.success) {
          sound.playContradictionSuccess();
          this.prerequisiteError = null;
          this.showEndingModal(result.ending);
        } else {
          sound.playClick();
          this.prerequisiteError = result.error;
          this.render();
        }
        return;
      }

      // Secret Master Cypher
      const btnCipher = e.target.closest('#btnSubmitCipher');
      if (btnCipher) {
        const input = this.container.querySelector('#cipherInput');
        const code = (input?.value || '').trim().toUpperCase();

        const result = state.executeEnding('JANUS_GLOBAL_AWAKENING', code);
        if (result.success) {
          sound.playContradictionSuccess();
          this.prerequisiteError = null;
          this.showEndingModal(result.ending);
        } else {
          sound.playClick();
          this.prerequisiteError = result.error;
          this.render();
        }
        return;
      }
    });
  }

  showEndingModal(ending) {
    const modal = document.createElement('div');
    modal.className = 'ending-modal-overlay';
    modal.innerHTML = `
      <div class="ending-modal-card" style="border-top: 6px solid ${ending.color};">
        <div class="modal-badge-row">
          <span class="ending-badge" style="background: ${ending.color};">${ending.badge}</span>
        </div>
        <h1 class="ending-title">${ending.title}</h1>
        <h3 class="ending-sub">${ending.subtitle}</h3>

        <div class="ending-body-text">
          <pre class="ending-formatted">${ending.description}</pre>
        </div>

        <div class="ending-actions">
          <button class="btn-restart-game" id="btnCloseEnding">Return to Investigation Workstation</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btnCloseEnding').addEventListener('click', () => {
      sound.playClick();
      modal.remove();
    });
  }
}
