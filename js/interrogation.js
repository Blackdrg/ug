// The Signature Feature: Live Contradiction Engine & Interrogation Matrix
import { SUSPECTS, CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class InterrogationEngine {
  constructor(containerEl, onClueDiscovered) {
    this.container = containerEl;
    this.onClueDiscovered = onClueDiscovered;
    this.activeSuspectId = state.selectedSuspectId || 'SUSP_VANCE';
    this.presentingClaimId = null;
    this.feedbackMessage = null;

    this.render();
    this.setupListeners();
  }

  setFocusClaim(claimId) {
    // Find suspect who owns this claim
    for (const s of SUSPECTS) {
      if (s.claims.some(c => c.id === claimId)) {
        this.activeSuspectId = s.id;
        this.presentingClaimId = claimId;
        this.render();
        break;
      }
    }
  }

  render() {
    const suspect = SUSPECTS.find(s => s.id === this.activeSuspectId) || SUSPECTS[0];
    const discoveredClues = state.getDiscoveredClues();

    this.container.innerHTML = `
      <div class="interrogation-layout">
        <!-- Suspects Roster Sidebar -->
        <aside class="suspect-roster">
          <div class="roster-header">
            <h3>RECORDED TESTIMONIES</h3>
            <span class="roster-badge">${SUSPECTS.length} Key Profiles</span>
          </div>

          <div class="suspect-list">
            ${SUSPECTS.map(s => {
              const active = s.id === suspect.id;
              const resolvedCount = s.claims.filter(c => state.isClaimResolved(c.id)).length;
              return `
                <div class="suspect-list-item ${active ? 'active' : ''}" data-suspect-id="${s.id}" tabindex="0" role="button" aria-label="View testimony of ${s.name}">
                  <div class="suspect-avatar">${s.avatar}</div>
                  <div class="suspect-item-info">
                    <div class="suspect-item-name">${s.name}</div>
                    <div class="suspect-item-role">${s.role}</div>
                    <div class="suspect-item-status ${resolvedCount === s.claims.length ? 'broken' : ''}">
                      ${resolvedCount === s.claims.length ? '⚡ TESTIMONY SHATTERED' : `${resolvedCount}/${s.claims.length} Contradictions`}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </aside>

        <!-- Main Interrogation Chambers -->
        <main class="interrogation-main">
          <!-- Suspect Profile Header -->
          <div class="suspect-dossier-card">
            <div class="suspect-header-top">
              <div class="suspect-identity">
                <span class="avatar-large">${suspect.avatar}</span>
                <div>
                  <h2 class="suspect-name">${suspect.name}</h2>
                  <div class="suspect-title-sub">${suspect.role} &bull; <span class="highlight-status">${suspect.status}</span></div>
                </div>
              </div>
              <div class="suspect-badge-security">JANUS SUB-LEVEL 3 DOSSIER</div>
            </div>

            <p class="suspect-bio">${suspect.bio}</p>
            <div class="suspect-motive"><strong>Suspected Motive / Secret:</strong> ${suspect.motive}</div>
          </div>

          <!-- Suspect Claims & Contradiction Presentation -->
          <div class="claims-section">
            <h3 class="section-title">RECORDED CLAIMS & STATEMENTS:</h3>

            ${this.feedbackMessage ? `
              <div class="feedback-banner ${this.feedbackMessage.type}" role="status" aria-live="polite">
                ${this.feedbackMessage.text}
              </div>
            ` : ''}

            <div class="claims-list">
              ${suspect.claims.map(claim => {
                const isContradicted = state.isClaimResolved(claim.id);
                const isPresenting = this.presentingClaimId === claim.id;

                return `
                  <div class="claim-card ${isContradicted ? 'contradicted' : 'uncontested'}">
                    <div class="claim-header">
                      <span class="claim-status-pill">
                        ${isContradicted ? '⚡ CONTRADICTED & DISPROVED' : '⚠️ OFFICIAL STATEMENT ON RECORD'}
                      </span>
                      ${!isContradicted ? `
                        <button class="btn-present-evidence ${isPresenting ? 'active' : ''}" data-claim-id="${claim.id}">
                          ${isPresenting ? 'Cancel Challenge' : '⚡ Challenge with Evidence'}
                        </button>
                      ` : ''}
                    </div>

                    <div class="claim-statement">${claim.statement}</div>

                    ${isContradicted ? `
                      <div class="claim-rebuttal-box">
                        <div class="rebuttal-label">SUSPECT REACTION / UNMASKED TRUTH:</div>
                        <div class="rebuttal-text">${claim.rebuttalText}</div>
                        ${claim.unlockedEvidence && state.isClueDiscovered(claim.unlockedEvidence) ? `
                          <div class="unlocked-lead-badge">
                            ✨ UNLOCKED CRITICAL EVIDENCE: <strong>${CLUES.find(c => c.id === claim.unlockedEvidence)?.title}</strong>
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}

                    <!-- Evidence Presentation Tray if challenging this claim -->
                    ${isPresenting && !isContradicted ? `
                      <div class="evidence-selection-tray">
                        <div class="tray-instruction">
                          SELECT EVIDENCE FROM YOUR CASE FILES TO REFUTE THIS STATEMENT:
                        </div>

                        ${discoveredClues.length === 0 ? `
                          <div class="tray-empty-alert" style="padding: 18px; text-align: center; color: #ffb86c; background: rgba(255, 184, 108, 0.08); border: 1px dashed rgba(255, 184, 108, 0.3); border-radius: 6px; font-size: 0.88rem;">
                            ⚠️ No evidence collected in field yet. Search the Facility rooms to recover clues before challenging testimonies.
                          </div>
                        ` : `
                          <div class="tray-grid">
                            ${discoveredClues.map(clue => `
                              <div class="tray-clue-card" tabindex="0" role="button" aria-label="Present clue ${clue.title}" data-refute-clue-id="${clue.id}" data-target-claim-id="${claim.id}">
                                <div class="tray-card-type tag-${clue.category.toLowerCase()}">${clue.category}</div>
                                <div class="tray-card-title">${clue.title}</div>
                                <div class="tray-card-summary">${clue.summary.substring(0, 65)}...</div>
                                <button class="btn-select-clue">Present Clue</button>
                              </div>
                            `).join('')}
                          </div>
                        `}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </main>
      </div>
    `;
  }

  handleSuspectSelect(suspectId) {
    sound.playClick();
    this.activeSuspectId = suspectId;
    this.presentingClaimId = null;
    this.feedbackMessage = null;
    this.render();
  }

  handlePresentClue(clueId, claimId) {
    const suspect = SUSPECTS.find(s => s.id === this.activeSuspectId);
    const claim = suspect?.claims.find(c => c.id === claimId);

    if (claim && claim.counterClueId === clueId) {
      // Success! Contradiction found!
      sound.playContradictionSuccess();
      state.resolveClaim(claimId, clueId);
      this.presentingClaimId = null;
      this.feedbackMessage = {
        type: 'success',
        text: '⚡ CONTRADICTION VERIFIED! The suspect’s claim has been refuted by physical evidence.'
      };
      if (this.onClueDiscovered && claim.unlockedEvidence) {
        this.onClueDiscovered(claim.unlockedEvidence);
      }
    } else {
      // Failure
      sound.playClick();
      this.feedbackMessage = {
        type: 'error',
        text: '❌ That clue does not contradict this specific statement. Re-examine the timestamps and forensics!'
      };
    }
    this.render();
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Switch Suspect
      const suspectItem = e.target.closest('.suspect-list-item');
      if (suspectItem) {
        this.handleSuspectSelect(suspectItem.dataset.suspectId);
        return;
      }

      // Toggle Challenge claim
      const btnChallenge = e.target.closest('.btn-present-evidence');
      if (btnChallenge) {
        sound.playClick();
        const claimId = btnChallenge.dataset.claimId;
        this.presentingClaimId = (this.presentingClaimId === claimId) ? null : claimId;
        this.feedbackMessage = null;
        this.render();
        return;
      }

      // Present Clue to refute claim
      const clueChoice = e.target.closest('.tray-clue-card');
      if (clueChoice) {
        const clueId = clueChoice.dataset.refuteClueId;
        const claimId = clueChoice.dataset.targetClaimId;
        this.handlePresentClue(clueId, claimId);
        return;
      }
    });

    // Keyboard navigation (Enter / Space on suspect items and clue cards)
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const suspectItem = e.target.closest('.suspect-list-item');
        if (suspectItem) {
          e.preventDefault();
          this.handleSuspectSelect(suspectItem.dataset.suspectId);
          return;
        }

        const clueCard = e.target.closest('.tray-clue-card');
        if (clueCard) {
          e.preventDefault();
          const clueId = clueCard.dataset.refuteClueId;
          const claimId = clueCard.dataset.targetClaimId;
          this.handlePresentClue(clueId, claimId);
          return;
        }
      }
    });
  }
}
