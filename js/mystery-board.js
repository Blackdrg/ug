// The Signature Feature: Rigorous Mystery Board with Multi-Type Yarn Strings & Relationship Facts
import { CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class MysteryBoard {
  constructor(containerEl, onSelectClue) {
    this.container = containerEl;
    this.onSelectClue = onSelectClue;
    this.connectingFromPinId = null;
    this.activeFilter = 'ALL';
    this.draggingItem = null;
    this.dragOffset = { x: 0, y: 0 };
    this.activeToast = null;
    this.selectedYarnId = null; // tracks first-click on yarn for delete confirmation

    // Suspect Mugshots matching Reference Personnel
    this.suspectMugshots = [
      { id: 'MUG_1', name: 'MARCUS VANCE', role: 'Operations Director', x: 70, y: 60, status: 'PERSON OF INTEREST' },
      { id: 'MUG_2', name: 'DR. ARIS CROSS', role: 'Senior Bio-Telemetry', x: 230, y: 60, status: 'SUSPECT' },
      { id: 'MUG_3', name: 'VICTOR KRAY', role: 'Head of Site Security', x: 390, y: 60, status: 'SUSPECT' },
      { id: 'MUG_4', name: 'ANYA NOVA', role: 'Systems Architect', x: 150, y: 260, status: 'SUSPECT' },
      { id: 'MUG_5', name: 'DR. ALISTAIR FINCH', role: 'Project Director (MIA)', x: 440, y: 280, status: 'MISSING' },
      { id: 'MUG_6', name: 'SUBJECT 13', role: 'Neural Test Subject', x: 100, y: 460, status: 'UNCONFIRMED' }
    ];

    this.render();
    this.setupListeners();
  }

  render() {
    const pinned = state.pinnedClues;
    const notes = state.stickyNotes;

    this.container.innerHTML = `
      <div class="corkboard-screen-container">
        <!-- Room Environment Background: Office with Rainy Window & Desk Lamp -->
        <div class="board-room-environment">
          <div class="room-rainy-window">
            <div class="rain-streaks"></div>
            <div class="window-sill"></div>
          </div>
          <div class="desk-surface-props">
            <div class="vintage-desk-lamp"></div>
            <div class="cassette-tape-prop"></div>
            <div class="manila-folders-stack"></div>
          </div>
        </div>

        <div class="corkboard-wrapper" id="corkboardWrapper">
          <!-- Board Top Control Bar -->
          <div class="board-toolbar" role="toolbar" aria-label="Evidence Board Controls">
            <div class="toolbar-group">
              <span class="board-badge">📌 EVIDENCE RECONSTRUCTION BOARD</span>
              <span class="clue-counter">${pinned.length} Pins &bull; ${state.yarnConnections.length} Yarn Threads</span>
            </div>

            <!-- Legend for Multi-Type Yarn Strings (Priority 2) -->
            <div class="yarn-legend-bar">
              <span class="legend-item legend-contradiction">● Contradiction (Red)</span>
              <span class="legend-item legend-corroboration">● Corroboration (Green)</span>
              <span class="legend-item legend-lead">● Lead / Association (Amber)</span>
            </div>

            <div class="toolbar-filters">
              <button class="filter-btn ${this.activeFilter === 'ALL' ? 'active' : ''}" data-filter="ALL" aria-label="Show all evidence">All</button>
              <button class="filter-btn ${this.activeFilter === 'SUSPECTS' ? 'active' : ''}" data-filter="SUSPECTS">Mugshots</button>
              <button class="filter-btn ${this.activeFilter === 'DOCUMENT' ? 'active' : ''}" data-filter="DOCUMENT">Documents</button>
              <button class="filter-btn ${this.activeFilter === 'AUDIO' ? 'active' : ''}" data-filter="AUDIO">Audio Tapes</button>
              <button class="filter-btn ${this.activeFilter === 'FORENSIC' ? 'active' : ''}" data-filter="FORENSIC">Forensic</button>
            </div>

            <div class="toolbar-actions">
              <button class="action-btn" id="btnAddSticky" title="Add Sticky Note [Alt+N]">
                <span>📝</span> Add Note
              </button>
              <button class="action-btn ${this.connectingFromPinId ? 'active-string-mode' : ''}" id="btnYarnMode" title="Connect Two Pins [Alt+C]">
                <span>🧵</span> ${this.connectingFromPinId ? 'Cancel String' : 'Connect Clues'}
              </button>
              <button class="action-btn" id="btnAutoArrange" title="Reset Grid Alignment [Alt+A]">
                <span>📐</span> Auto-Align
              </button>
            </div>
          </div>

          <!-- Realistic Corkboard Texture with Mahogany Frame -->
          <div class="cork-surface" id="corkSurface" tabindex="0" aria-label="Interactive cork surface">
            ${this.connectingFromPinId ? `
              <div class="yarn-instruction-banner" role="status" aria-live="polite">
                🧵 <strong>STRING CONNECTION MODE ACTIVE:</strong> Click any push-pin to complete the connection, or click "Cancel String".
              </div>
            ` : ''}

            <!-- SVG Yarn Connection Layer -->
            <svg class="yarn-svg-layer" id="yarnSvgLayer"></svg>

            <!-- Center Blueprint Map of Sub-Level 3 -->
            <div class="board-center-blueprint" id="boardBlueprint">
              <div class="blueprint-stamp">ARCHITECTURAL SCHEMATIC &bull; SUB-LEVEL 3</div>
              <div class="blueprint-grid"></div>
            </div>

            <!-- Central 13th File Card -->
            <div class="center-13th-file-card" id="center13Card">
              <div class="card-13-header">CLASSIFIED</div>
              <div class="card-13-title">THE 13TH FILE?</div>
              <div class="card-13-sub">"Twelve people vanished. One person was never there."</div>
              <div class="card-13-pin push-pin" data-pin-id="CLUE_13TH_FILE" tabindex="0" role="button" aria-label="13th File Central Pin">
                <div class="pin-head"></div>
              </div>
            </div>

            <!-- Suspect Black-and-White Mugshots -->
            ${this.suspectMugshots.map(m => `
              <div class="suspect-mugshot-card ${this.activeFilter === 'ALL' || this.activeFilter === 'SUSPECTS' ? '' : 'dimmed'}" 
                   id="mug_${m.id}" 
                   style="left: ${m.x}px; top: ${m.y}px;"
                   tabindex="0"
                   aria-label="Suspect mugshot ${m.name}">
                <div class="mugshot-pin push-pin" data-pin-id="${m.id}" role="button" aria-label="Pin for ${m.name}">
                  <div class="pin-head"></div>
                </div>
                <div class="mugshot-photo-frame">
                  <div class="mugshot-portrait portrait-${m.id.toLowerCase()}"></div>
                </div>
                <div class="mugshot-name-tag">
                  <span class="mug-name">${m.name}</span>
                  <span class="mug-question">${m.status}</span>
                </div>
              </div>
            `).join('')}

            <!-- Pinned Evidence Cards -->
            <div class="cards-layer" id="cardsLayer">
              ${pinned.map(p => {
                const clue = CLUES.find(c => c.id === p.id);
                if (!clue) return '';
                const matchesFilter = this.activeFilter === 'ALL' || clue.category === this.activeFilter;
                const hasContradiction = clue.contradictsClaimId && state.isClaimResolved(clue.contradictsClaimId);
                const isSource = this.connectingFromPinId === clue.id;

                return `
                  <div class="board-clue-card ${matchesFilter ? '' : 'dimmed'} ${isSource ? 'string-source' : ''} ${hasContradiction ? 'contradiction-border' : ''}" 
                       id="card_${clue.id}"
                       data-clue-id="${clue.id}"
                       style="left: ${p.x}px; top: ${p.y}px;"
                       tabindex="0"
                       aria-label="Evidence card: ${clue.title}">
                    
                    <div class="push-pin ${isSource ? 'pulse-pin' : ''}" data-pin-id="${clue.id}" role="button" aria-label="Connect yarn string from ${clue.title}">
                      <div class="pin-head"></div>
                    </div>

                    <div class="card-meta">
                      <span class="card-category-tag tag-${clue.category.toLowerCase()}">${clue.category}</span>
                      <span class="card-date">${clue.dateStamp ? clue.dateStamp.split('-')[0] : ''}</span>
                    </div>

                    <h4 class="card-title">${clue.title}</h4>
                    <p class="card-summary">${clue.summary.substring(0, 75)}...</p>

                    <div class="card-footer">
                      <span class="card-room">${clue.roomName.split(' ')[0]}</span>
                      <button class="btn-inspect-small" data-inspect-id="${clue.id}" title="Examine Clue in Dossier">Inspect</button>
                    </div>
                  </div>
                `;
              }).join('')}

              <!-- Sticky Notes -->
              ${notes.map(n => `
                <div class="sticky-note" id="sticky_${n.id}" data-sticky-id="${n.id}" style="left: ${n.x}px; top: ${n.y}px; background-color: ${n.color};" tabindex="0">
                  <div class="sticky-pin"></div>
                  <button class="sticky-delete-btn" data-delete-sticky="${n.id}" title="Delete Note" aria-label="Delete note">&times;</button>
                  <textarea class="sticky-textarea" placeholder="Write observation..." aria-label="Sticky note text">${n.text}</textarea>
                </div>
              `).join('')}
            </div>

            <!-- Toast / Relationship Fact Established Banner (Priority 2) -->
            <div class="fact-established-banner" id="factBanner"></div>
          </div>
        </div>
      </div>
    `;

    this.drawYarnConnections();
  }

  setupListeners() {
    const surface = this.container.querySelector('#corkSurface');
    if (!surface) return;

    // Drag and drop for cards, mugshots, and stickies
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.closest('textarea') || e.target.closest('button')) return;

      const card = e.target.closest('.board-clue-card');
      const sticky = e.target.closest('.sticky-note');
      const mug = e.target.closest('.suspect-mugshot-card');

      if (card || sticky || mug) {
        const target = card || sticky || mug;
        const rect = target.getBoundingClientRect();
        const surfaceRect = surface.getBoundingClientRect();

        this.draggingItem = {
          el: target,
          id: card ? card.dataset.clueId : (sticky ? sticky.dataset.stickyId : mug.id),
          isClue: !!card,
          isSticky: !!sticky,
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top,
          surfaceLeft: surfaceRect.left,
          surfaceTop: surfaceRect.top
        };

        target.classList.add('is-dragging');
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.draggingItem) return;

      const surfaceRect = surface.getBoundingClientRect();
      let newX = e.clientX - surfaceRect.left - this.draggingItem.offsetX;
      let newY = e.clientY - surfaceRect.top - this.draggingItem.offsetY;

      newX = Math.max(10, Math.min(newX, surfaceRect.width - 220));
      newY = Math.max(10, Math.min(newY, surfaceRect.height - 180));

      this.draggingItem.el.style.left = `${newX}px`;
      this.draggingItem.el.style.top = `${newY}px`;

      if (this.draggingItem.isClue) {
        state.updatePinPosition(this.draggingItem.id, newX, newY);
      } else if (this.draggingItem.isSticky) {
        state.updateStickyNote(this.draggingItem.id, undefined, newX, newY);
      }

      this.drawYarnConnections();
    });

    window.addEventListener('mouseup', () => {
      if (this.draggingItem) {
        this.draggingItem.el.classList.remove('is-dragging');
        sound.playPinTap();
        this.draggingItem = null;
      }
    });

    // Clicks on buttons, pins, inspect
    this.container.addEventListener('click', (e) => {
      // Pin Click (Yarn connection start/end)
      const pin = e.target.closest('.push-pin');
      if (pin) {
        const pinId = pin.dataset.pinId;
        if (!this.connectingFromPinId) {
          this.connectingFromPinId = pinId;
          sound.playClick();
          this.showFactNotification(`String anchored to pin. Click another pin to connect.`);
          this.render();
        } else {
          if (this.connectingFromPinId !== pinId) {
            const result = state.addYarnConnection(this.connectingFromPinId, pinId);
            if (result.success) {
              sound.playPinTap();
              if (result.yarn.isContradiction) {
                sound.playContradictionSuccess();
              }
              // Priority 2: Show why the connection is valid and which fact it establishes
              this.showFactNotification(`[${result.yarn.type}] ${result.yarn.factEstablished}`);
            } else {
              this.showFactNotification(`Notice: ${result.reason}`);
            }
          }
          this.connectingFromPinId = null;
          this.render();
        }
        return;
      }

      // Inspect Button
      const inspectBtn = e.target.closest('.btn-inspect-small');
      if (inspectBtn) {
        const clueId = inspectBtn.dataset.inspectId;
        sound.playClick();
        if (this.onSelectClue) this.onSelectClue(clueId);
        return;
      }

      // Filter button
      const filterBtn = e.target.closest('.filter-btn');
      if (filterBtn) {
        sound.playClick();
        this.activeFilter = filterBtn.dataset.filter;
        this.render();
        return;
      }

      // Add sticky
      const btnAddSticky = e.target.closest('#btnAddSticky');
      if (btnAddSticky) {
        sound.playClick();
        const sampleNotes = [
          '23:40 - Power substation surge logged.',
          'Review camera timestamps against security shift change.',
          'Where is Dr. Finch\'s private laboratory ledger?',
          'Telemetry spike recorded before fire suppression triggered.',
          'Identify the 13th occupant in Sub-Level 3.'
        ];
        const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
        state.addStickyNote(randomNote);
        this.render();
        return;
      }

      // Yarn mode button
      const btnYarnMode = e.target.closest('#btnYarnMode');
      if (btnYarnMode) {
        sound.playClick();
        if (this.connectingFromPinId) {
          this.connectingFromPinId = null;
        } else if (state.pinnedClues.length >= 2) {
          this.connectingFromPinId = state.pinnedClues[0].id;
        }
        this.render();
        return;
      }

      // Auto align button
      const btnAuto = e.target.closest('#btnAutoArrange');
      if (btnAuto) {
        sound.playClick();
        state.pinnedClues.forEach((p, idx) => {
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          p.x = 80 + col * 260;
          p.y = 80 + row * 220;
        });
        state.notify('BOARD_REORGANIZED');
        this.render();
        return;
      }

      // Delete sticky
      const deleteSticky = e.target.closest('.sticky-delete-btn');
      if (deleteSticky) {
        sound.playClick();
        const id = deleteSticky.dataset.deleteSticky;
        state.deleteStickyNote(id);
        this.render();
        return;
      }

      // Yarn line click: first click selects + shows fact, second click deletes
      const yarnPath = e.target.closest('.yarn-line');
      if (yarnPath) {
        const fromId = yarnPath.dataset.fromId;
        const toId = yarnPath.dataset.toId;
        const yarn = state.yarnConnections.find(
          y => (y.fromId === fromId && y.toId === toId) || (y.fromId === toId && y.toId === fromId)
        );
        if (yarn) {
          if (this.selectedYarnId === yarn.id) {
            // Second click — delete
            sound.playClick();
            state.removeYarnConnection(yarn.fromId, yarn.toId);
            this.selectedYarnId = null;
            this.showFactNotification(`🗑️ Connection removed: ${yarn.factEstablished}`);
            this.render();
          } else {
            // First click — select + show fact
            sound.playClick();
            this.selectedYarnId = yarn.id;
            this.showFactNotification(`[${yarn.type}] ${yarn.factEstablished} ↩ Click again to remove.`);
            // Re-draw to show selection highlight
            this.drawYarnConnections();
          }
        }
        return;
      }
    });

    // Sticky textarea input
    this.container.addEventListener('input', (e) => {
      const textarea = e.target.closest('.sticky-textarea');
      if (textarea) {
        const sticky = textarea.closest('.sticky-note');
        if (sticky) {
          state.updateStickyNote(sticky.dataset.stickyId, textarea.value);
        }
      }
    });
  }

  showFactNotification(message) {
    const banner = this.container.querySelector('#factBanner');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.add('show');
    clearTimeout(this.activeToast);
    this.activeToast = setTimeout(() => {
      banner.classList.remove('show');
    }, 4500);
  }

  // Priority 2: Distinct line styling for Contradiction, Corroboration, and Lead
  drawYarnConnections() {
    const svg = this.container.querySelector('#yarnSvgLayer');
    if (!svg) return;

    svg.innerHTML = '';
    const surfaceRect = this.container.querySelector('#corkSurface').getBoundingClientRect();

    state.yarnConnections.forEach(yarn => {
      const elFrom = this.container.querySelector(`#card_${yarn.fromId}`) ||
                     (yarn.fromId === 'CLUE_13TH_FILE' ? this.container.querySelector('#center13Card') : null) ||
                     this.container.querySelector(`#mug_${yarn.fromId}`);

      const elTo = this.container.querySelector(`#card_${yarn.toId}`) ||
                   (yarn.toId === 'CLUE_13TH_FILE' ? this.container.querySelector('#center13Card') : null) ||
                   this.container.querySelector(`#mug_${yarn.toId}`);

      if (elFrom && elTo) {
        const pinFrom = elFrom.querySelector('.push-pin');
        const pinTo = elTo.querySelector('.push-pin');

        if (pinFrom && pinTo) {
          const rectA = pinFrom.getBoundingClientRect();
          const rectB = pinTo.getBoundingClientRect();

          const x1 = rectA.left + rectA.width / 2 - surfaceRect.left;
          const y1 = rectA.top + rectA.height / 2 - surfaceRect.top;
          const x2 = rectB.left + rectB.width / 2 - surfaceRect.left;
          const y2 = rectB.top + rectB.height / 2 - surfaceRect.top;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 + Math.min(40, Math.hypot(x2 - x1, y2 - y1) * 0.07);

          const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', pathData);
          
          let cssClass = 'yarn-standard';
          let badgeText = '';

          if (yarn.type === 'CONTRADICTION') {
            cssClass = 'yarn-contradiction';
            badgeText = '⚡ CONTRADICTION';
          } else if (yarn.type === 'CORROBORATION') {
            cssClass = 'yarn-corroboration';
            badgeText = '✓ CORROBORATION';
          } else {
            cssClass = 'yarn-lead';
            badgeText = '🔍 LEAD';
          }

          path.setAttribute('class', `yarn-line ${cssClass}`);
          path.setAttribute('data-from-id', yarn.fromId);
          path.setAttribute('data-to-id', yarn.toId);
          path.setAttribute('title', yarn.factEstablished || 'Connection');

          g.appendChild(path);

          if (badgeText) {
            const badge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            badge.setAttribute('x', midX);
            badge.setAttribute('y', midY - 6);
            badge.setAttribute('class', `yarn-badge-label badge-${(yarn.type || 'lead').toLowerCase()}`);
            badge.textContent = badgeText;
            g.appendChild(badge);
          }

          svg.appendChild(g);
        }
      }
    });
  }
}
