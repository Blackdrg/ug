// Forensic Evidence Dossier & UV Examination Laboratory
import { CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class EvidenceDossier {
  constructor(containerEl, onOpenInterrogation) {
    this.container = containerEl;
    this.onOpenInterrogation = onOpenInterrogation;
    this.activeClueId = state.discoveredClueIds[0] || 'CLUE_13TH_FILE';
    this.isPlayingTape = false;
    this.tapeInterval = null;
    this.tapeProgress = 0;

    this.render();
    this.setupListeners();
  }

  showClue(clueId) {
    if (clueId && state.isClueDiscovered(clueId)) {
      this.activeClueId = clueId;
      this.stopTape();
      this.render();
    }
  }

  render() {
    const discovered = state.getDiscoveredClues();
    const activeClue = CLUES.find(c => c.id === this.activeClueId) || discovered[0] || CLUES[0];
    const isPinned = state.pinnedClues.some(p => p.id === activeClue.id);

    this.container.innerHTML = `
      <div class="dossier-layout">
        <!-- Left Sidebar: Discovered Evidence Inventory -->
        <aside class="dossier-sidebar">
          <div class="sidebar-header">
            <h3>CASE FILE EVIDENCE</h3>
            <span class="evidence-count">${discovered.length} / ${CLUES.length} Found</span>
          </div>

          <div class="evidence-list" id="evidenceList">
            ${discovered.map(c => `
              <div class="evidence-list-item ${c.id === activeClue.id ? 'active' : ''}" data-clue-id="${c.id}">
                <div class="item-tag tag-${c.category.toLowerCase()}">${c.category}</div>
                <div class="item-body">
                  <div class="item-title">${c.title}</div>
                  <div class="item-meta">${c.roomName.split(' ')[0]} &bull; ${c.dateStamp ? c.dateStamp.split(' ')[0] : ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- Right Main Panel: Forensic Examination Station -->
        <main class="dossier-main ${state.uvEnabled ? 'uv-active' : ''}">
          <!-- Dossier Top Controls -->
          <div class="dossier-toolbar">
            <div class="clue-classification">
              <span class="badge-evidence-id">${activeClue.id}</span>
              <span class="badge-status">EVIDENCE REGISTERED</span>
            </div>

            <div class="forensic-tools">
              <button class="tool-btn ${state.uvEnabled ? 'active-uv' : ''}" id="btnDossierUV" title="Toggle UV Blacklight to detect concealed markings">
                <span>🟣</span> UV BLACKLIGHT: ${state.uvEnabled ? 'ON' : 'OFF'}
              </button>
              <button class="tool-btn ${isPinned ? 'pinned' : ''}" id="btnTogglePin" title="Pin / Unpin on Mystery Board">
                <span>📌</span> ${isPinned ? 'PINNED ON BOARD' : 'PIN TO BOARD'}
              </button>
              ${activeClue.contradictsClaimId ? `
                <button class="tool-btn btn-highlight" id="btnGoToContradict" data-claim-id="${activeClue.contradictsClaimId}">
                  <span>⚡</span> CONFRONT SUSPECT
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Document / Evidence Body Viewport -->
          <div class="evidence-viewport ${activeClue.category.toLowerCase()}-type">
            <!-- Header Stamp -->
            <div class="dossier-stamp">SUB-LEVEL 3 ARCHIVE ARCHIVAL RECORD</div>
            <h2 class="evidence-headline">${activeClue.title}</h2>
            <div class="evidence-location-bar">
              <span>📍 DISCOVERY SITE: ${activeClue.roomName}</span>
              <span>🕒 RECORDED TIMESTAMP: ${activeClue.dateStamp || 'UNKNOWN'}</span>
            </div>

            <!-- Content Area -->
            <div class="evidence-content-container">
              ${activeClue.category === 'AUDIO' ? this.renderAudioPlayer(activeClue) : ''}
              
              <div class="evidence-text-card ${state.uvEnabled ? 'uv-glow-text' : ''}">
                <pre class="evidence-raw-text">${activeClue.content || activeClue.transcript || activeClue.summary}</pre>

                <!-- Hidden UV Markings -->
                ${activeClue.uvHiddenText ? `
                  <div class="uv-hidden-layer ${state.uvEnabled ? 'revealed' : 'hidden'}">
                    <div class="uv-badge">⚡ FLUORESCENT CHEMICAL TRACE DETECTED:</div>
                    <div class="uv-text-content">${activeClue.uvHiddenText}</div>
                  </div>
                ` : ''}
              </div>

              <!-- Forensic Tags & Metadata -->
              <div class="evidence-tags-row">
                <span class="tag-label">TAGS:</span>
                ${activeClue.tags.map(t => `<span class="evidence-chip">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  renderAudioPlayer(clue) {
    return `
      <div class="tape-deck-module">
        <div class="tape-deck-header">
          <div class="tape-reels">
            <div class="tape-reel reel-left ${this.isPlayingTape ? 'spinning' : ''}"></div>
            <div class="tape-window">
              <span class="tape-label">MICRO-CASSETTE 2009</span>
              <div class="tape-spool-progress" style="width: ${this.tapeProgress}%"></div>
            </div>
            <div class="tape-reel reel-right ${this.isPlayingTape ? 'spinning' : ''}"></div>
          </div>
          <div class="tape-timer">${clue.audioDuration || '00:45'}</div>
        </div>

        <!-- Animated Waveform Visualizer -->
        <div class="tape-waveform">
          ${Array.from({ length: 32 }).map((_, i) => `
            <div class="wave-bar ${this.isPlayingTape ? 'active' : ''}" style="animation-delay: ${i * 0.04}s"></div>
          `).join('')}
        </div>

        <div class="tape-controls">
          <button class="tape-btn" id="btnPlayTape">
            ${this.isPlayingTape ? '⏸️ PAUSE RECORDING' : '▶️ PLAY AUDIO CASSETTE'}
          </button>
          <button class="tape-btn-secondary" id="btnRewindTape">⏮️ REWIND</button>
        </div>
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Evidence List select
      const item = e.target.closest('.evidence-list-item');
      if (item) {
        const id = item.dataset.clueId;
        sound.playClick();
        this.showClue(id);
        return;
      }

      // UV Toggle
      const btnUV = e.target.closest('#btnDossierUV');
      if (btnUV) {
        sound.playClick();
        state.uvEnabled = !state.uvEnabled;
        state.notify('UV_TOGGLED', { uvEnabled: state.uvEnabled });
        this.render();
        return;
      }

      // Pin Toggle
      const btnPin = e.target.closest('#btnTogglePin');
      if (btnPin) {
        sound.playPinTap();
        const isPinned = state.pinnedClues.some(p => p.id === this.activeClueId);
        if (isPinned) {
          state.unpinClueFromBoard(this.activeClueId);
        } else {
          state.pinClueToBoard(this.activeClueId);
        }
        this.render();
        return;
      }

      // Confront Suspect button
      const btnContradict = e.target.closest('#btnGoToContradict');
      if (btnContradict) {
        sound.playClick();
        if (this.onOpenInterrogation) {
          this.onOpenInterrogation(btnContradict.dataset.claimId, this.activeClueId);
        }
        return;
      }

      // Play Audio Cassette
      const btnPlay = e.target.closest('#btnPlayTape');
      if (btnPlay) {
        if (this.isPlayingTape) {
          this.stopTape();
        } else {
          this.startTape();
        }
        this.render();
        return;
      }

      // Rewind
      const btnRewind = e.target.closest('#btnRewindTape');
      if (btnRewind) {
        sound.playClick();
        this.tapeProgress = 0;
        this.render();
        return;
      }
    });
  }

  startTape() {
    this.isPlayingTape = true;
    sound.playTapeStatic();
    if (this.tapeInterval) clearInterval(this.tapeInterval);
    this.tapeInterval = setInterval(() => {
      this.tapeProgress += 4;
      if (this.tapeProgress >= 100) {
        this.stopTape();
        this.render();
      } else {
        const spool = this.container.querySelector('.tape-spool-progress');
        if (spool) spool.style.width = `${this.tapeProgress}%`;
      }
    }, 400);
  }

  stopTape() {
    this.isPlayingTape = false;
    if (this.tapeInterval) {
      clearInterval(this.tapeInterval);
      this.tapeInterval = null;
    }
  }
}
