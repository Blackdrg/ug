// Interactive Facility Room Exploration Engine with Handheld Tools & Cinematic Subtitles
import { ROOMS, CLUES } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class ExplorationEngine {
  constructor(containerEl, onInspectClue) {
    this.container = containerEl;
    this.onInspectClue = onInspectClue;
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.flashlightOn = true;

    // Hotspot coordinates across all 4 atmospheric scenes
    this.hotspots = {
      ROOM_OBSERVATION: [
        { id: 'CLUE_PERIMETER_FENCE', label: 'Severed Chain-Link Gate (North Breach)', x: 48, y: 56, icon: '✂️' },
        { id: 'CLUE_CAMERA_LOG', label: 'Security Tower Optical Feed Box', x: 28, y: 44, icon: '📹' },
        { id: 'CLUE_SECURITY_BADGE', label: 'Rusted Catwalk Railing Catch', x: 38, y: 72, icon: '🪪' },
        { id: 'CLUE_HANDWRITTEN_NOTE', label: 'Observation Point Clipboard Clip', x: 18, y: 64, icon: '📝' }
      ],
      ROOM_DRAINAGE: [
        { id: 'CLUE_TUNNEL_GRAFFITI', label: 'Red Wall Graffiti: "THEY ARE NOT GOING TO LET US OUT - 13"', x: 86, y: 48, icon: '🩸' },
        { id: 'CLUE_MAINTENANCE_LOG', label: 'Sub-Level 3 Bypass Culvert Valve', x: 42, y: 62, icon: '🔧' },
        { id: 'CLUE_BURNT_FUSE', label: 'Charred Conduit Box on Waterline', x: 56, y: 74, icon: '🔥' },
        { id: 'CLUE_AUDIO_TAPE_THORNE', label: 'Emergency Drainage Sump Grate', x: 32, y: 80, icon: '📼' }
      ],
      ROOM_LAB: [
        { id: 'CLUE_CRYO_LOG', label: 'Cryo-Chamber Pod #13 (Active Gamma Sync)', x: 28, y: 46, icon: '❄️' },
        { id: 'CLUE_AUTOPSY_REPORT', label: 'Surgical Metal Examination Gurney', x: 48, y: 62, icon: '📋' },
        { id: 'CLUE_AUDIO_TAPE_CRUZ', label: 'Ventilation Exhaust Grill (Hidden SOS Tape)', x: 68, y: 32, icon: '🎙️' },
        { id: 'CLUE_NEURAL_READOUT', label: 'Janus EEG Memory Imprint Console', x: 80, y: 56, icon: '🧠' }
      ],
      ROOM_ARCHIVE: [
        { id: 'CLUE_13TH_FILE', label: 'Classified Manila Locker: "Dr. Paul Vance"', x: 30, y: 46, icon: '📁' },
        { id: 'CLUE_PAYROLL_AUDIT', label: 'External Auditor Kray Hardbound Ledger', x: 50, y: 60, icon: '📑' },
        { id: 'CLUE_JANUS_DIRECTIVE', label: "Director Finch's Termination Protocol #09", x: 70, y: 48, icon: '📜' },
        { id: 'CLUE_AUDIO_TAPE_FINCH', label: 'Master Reel-to-Reel Dictaphone', x: 86, y: 64, icon: '🎙️' }
      ]
    };

    this.render();
    this.setupListeners();
  }

  render() {
    const room = ROOMS.find(r => r.id === state.currentRoomId) || ROOMS[0];
    const roomSpots = this.hotspots[room.id] || [];

    this.container.innerHTML = `
      <div class="exploration-viewport" id="expViewport">
        <!-- Room background with atmospheric rain/steam and 3D industrial styling -->
        <div class="room-backdrop" id="roomBackdrop" data-room="${room.id}">
          <div class="rain-overlay"></div>
          <div class="ambient-vignette"></div>
          <div class="steam-mist"></div>
          
          ${room.id === 'ROOM_DRAINAGE' ? `
            <div class="culvert-water-reflection"></div>
            <div class="culvert-wall-graffiti">
              <div class="graffiti-text">THEY ARE NOT GOING TO LET US OUT</div>
              <div class="graffiti-13">13</div>
            </div>
          ` : ''}

          <div class="room-watermark">${room.id}</div>
        </div>

        <!-- Dynamic Flashlight / Lantern Volumetric Lighting -->
        <div class="flashlight-mask" id="flashlightMask"></div>

        <!-- First-Person In-Hand Equipment Overlays matching reference screenshots -->
        ${this.renderFirstPersonHands(room)}

        <!-- Top HUD Header -->
        <div class="room-hud-top">
          <div class="room-title-block">
            <div class="room-badge"><span class="pulse-dot"></span> LIVE INVESTIGATION &bull; 2026 FIELD RECONSTRUCTION</div>
            <h2 class="room-name">${room.name}</h2>
            <p class="room-subtitle">${room.subtitle}</p>
          </div>
          <div class="room-hud-controls">
            <button class="hud-btn" id="btnToggleFlashlight" title="Toggle Light Source">
              <span class="hud-icon">${room.id === 'ROOM_DRAINAGE' ? '🏮' : '🔦'}</span> 
              <span class="btn-label">${room.id === 'ROOM_DRAINAGE' ? 'STORM LANTERN' : 'FLASHLIGHT'}</span>
            </button>
            <button class="hud-btn" id="btnToggleUV" title="Toggle UV Blacklight (Fluorescent Forensics)">
              <span class="hud-icon">🟣</span> 
              <span class="btn-label">UV BLACKLIGHT [${state.uvEnabled ? 'ACTIVE' : 'OFF'}]</span>
            </button>
          </div>
        </div>

        <!-- Interactive Hotspots -->
        <div class="hotspots-layer" id="hotspotsLayer">
          ${roomSpots.map(spot => {
            const isFound = state.isClueDiscovered(spot.id);
            return `
              <div class="hotspot-node ${isFound ? 'found' : 'unsearched'}" 
                   style="left: ${spot.x}%; top: ${spot.y}%;"
                   data-clue-id="${spot.id}"
                   tabindex="0">
                <div class="hotspot-pulse"></div>
                <div class="hotspot-icon">${spot.icon}</div>
                <div class="hotspot-tooltip">
                  <div class="tooltip-status">${isFound ? '✓ FORENSIC EVIDENCE CATALOGED' : '🔍 UNSEARCHED DETAIL'}</div>
                  <div class="tooltip-label">${spot.label}</div>
                  <div class="tooltip-action">Click to examine closely</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Cinematic Subtitle Banner matching Reference Image 1 & 2 -->
        <div class="cinematic-subtitle-bar" id="subtitleBar">
          <div class="subtitle-content">
            <span class="speaker-tag">INVESTIGATOR:</span>
            <span class="dialogue-text">${room.narration ? room.narration.replace('INVESTIGATOR: ', '') : ''}</span>
          </div>
          <div class="action-diamond-indicator" title="Narrative Insight Unlocked">✦</div>
        </div>

        <!-- Room Switcher Navigation Carousel -->
        <div class="room-navigator">
          <div class="navigator-label">FACILITY SECTORS:</div>
          <div class="navigator-buttons">
            ${ROOMS.map(r => {
              const active = r.id === state.currentRoomId;
              const cluesInRoom = r.clueIds;
              const foundCount = cluesInRoom.filter(id => state.isClueDiscovered(id)).length;
              return `
                <button class="nav-room-btn ${active ? 'active' : ''}" data-room-id="${r.id}">
                  <span class="nav-room-name">${r.name}</span>
                  <span class="nav-room-progress">${foundCount}/${cluesInRoom.length} Evidence</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.updateLighting();
    this.updateUVModeUI();
  }

  renderFirstPersonHands(room) {
    if (room.id === 'ROOM_OBSERVATION') {
      // Image 1: Observation Catwalk with Left Hand Clipboard & Center Spotting Scope
      return `
        <div class="first-person-hands-overlay mode-observation">
          <!-- Left Hand: Weathered Observation Clipboard Paper with Architectural Sketch -->
          <div class="hand-held-item left-item observation-clipboard">
            <div class="clipboard-paper">
              <div class="paper-header">OBSERVATION POINT 4</div>
              <div class="paper-question">Who cut the perimeter fence?</div>
              <div class="paper-floorplan">
                <div class="plan-box main-building">
                  <span class="plan-label">Primary optical research facility</span>
                </div>
                <div class="plan-box cut-gate">
                  <span class="cut-indicator">✂️ Cut Fence</span>
                </div>
              </div>
              <div class="paper-footer-notes">
                <span>Location: NW Boundary</span>
                <span>Cut from inside outward &bull; Exit rush</span>
              </div>
            </div>
            <div class="gloved-hand-thumb"></div>
          </div>

          <!-- Center/Right: Optical Spotting Device Viewfinder with Lens Reflection -->
          <div class="hand-held-item right-item optical-spotting-device">
            <div class="spotting-scope-housing">
              <div class="scope-reticle">
                <div class="reticle-crosshair"></div>
                <div class="reticle-lens-glare"></div>
                <div class="reticle-ring"></div>
              </div>
              <div class="scope-dial"></div>
            </div>
            <div class="gloved-hand-grip"></div>
          </div>
        </div>
      `;
    } else if (room.id === 'ROOM_DRAINAGE') {
      // Images 2 & 3: Flooded Tunnel with Left GPS Communicator & Right Vintage Hurricane Lantern
      return `
        <div class="first-person-hands-overlay mode-drainage">
          <!-- Left Hand: GPS Device & Survey Pipeline Map -->
          <div class="hand-held-item left-item gps-communicator">
            <div class="gps-casing">
              <div class="gps-screen">
                <div class="gps-signal">● REC &bull; 42.88°N 71.45°W</div>
                <div class="gps-map-preview">
                  <div class="route-line">THE 12</div>
                </div>
              </div>
            </div>
            <div class="sublevel-survey-map">
              <div class="map-title">SUB-LEVEL 3: PIPELINE ACCESSIBILITY</div>
              <div class="map-path-red">ESCAPE TRAIL &bull; "THE 12"</div>
            </div>
            <div class="gloved-hand-thumb"></div>
          </div>

          <!-- Right Hand: Heavy Brass Hurricane Lantern -->
          <div class="hand-held-item right-item hurricane-lantern">
            <div class="lantern-brass-cap"></div>
            <div class="lantern-glass-globe">
              <div class="lantern-wick-flame"></div>
              <div class="lantern-inner-glow"></div>
            </div>
            <div class="lantern-brass-base"></div>
            <div class="lantern-wire-handle"></div>
            <div class="gloved-hand-lantern-grip"></div>
          </div>
        </div>
      `;
    }
    return '';
  }

  setupListeners() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      this.mouseX = Math.max(0, Math.min(1, x));
      this.mouseY = Math.max(0, Math.min(1, y));
      this.updateLighting();
    });

    this.container.addEventListener('click', (e) => {
      // Hotspot click -> In-room Quick Inspection
      const node = e.target.closest('.hotspot-node');
      if (node) {
        const clueId = node.dataset.clueId;
        sound.playClueFound();
        state.discoverClue(clueId);
        this.showQuickInspectModal(clueId);
        this.render();
        return;
      }

      // Room switcher click
      const roomBtn = e.target.closest('.nav-room-btn');
      if (roomBtn) {
        const roomId = roomBtn.dataset.roomId;
        if (roomId && roomId !== state.currentRoomId) {
          sound.playClick();
          state.currentRoomId = roomId;
          state.notify('ROOM_CHANGED', { roomId });
          this.render();
        }
        return;
      }

      // Flashlight / Lantern toggle
      const btnFlash = e.target.closest('#btnToggleFlashlight');
      if (btnFlash) {
        sound.playFlashlight();
        this.flashlightOn = !this.flashlightOn;
        this.updateLighting();
        btnFlash.classList.toggle('active', this.flashlightOn);
        return;
      }

      // UV toggle
      const btnUV = e.target.closest('#btnToggleUV');
      if (btnUV) {
        sound.playClick();
        state.uvEnabled = !state.uvEnabled;
        state.notify('UV_TOGGLED', { uvEnabled: state.uvEnabled });
        this.updateUVModeUI();
        return;
      }
    });
  }

  updateLighting() {
    const mask = this.container.querySelector('#flashlightMask');
    if (!mask) return;

    if (!this.flashlightOn) {
      mask.style.background = 'rgba(2, 6, 12, 0.96)';
      return;
    }

    const xPercent = (this.mouseX * 100).toFixed(1);
    const yPercent = (this.mouseY * 100).toFixed(1);
    const room = ROOMS.find(r => r.id === state.currentRoomId);

    if (state.uvEnabled) {
      mask.style.background = `radial-gradient(circle 300px at ${xPercent}% ${yPercent}%, rgba(130, 30, 220, 0.18) 0%, rgba(35, 6, 65, 0.65) 45%, rgba(2, 1, 6, 0.96) 100%)`;
    } else if (room?.id === 'ROOM_DRAINAGE') {
      // Warm incandescent hurricane lantern beam
      mask.style.background = `radial-gradient(circle 380px at ${xPercent}% ${yPercent}%, rgba(255, 180, 50, 0.12) 0%, rgba(180, 100, 20, 0.3) 35%, rgba(6, 12, 16, 0.92) 80%, rgba(1, 4, 6, 0.98) 100%)`;
    } else {
      // Sharp industrial tactical beam
      mask.style.background = `radial-gradient(circle 320px at ${xPercent}% ${yPercent}%, rgba(220, 240, 255, 0.08) 0%, rgba(12, 28, 48, 0.45) 40%, rgba(2, 6, 12, 0.95) 100%)`;
    }
  }

  updateUVModeUI() {
    const btnUV = this.container.querySelector('#btnToggleUV');
    if (btnUV) {
      btnUV.classList.toggle('uv-active', state.uvEnabled);
      const label = btnUV.querySelector('.btn-label');
      if (label) label.textContent = `UV BLACKLIGHT [${state.uvEnabled ? 'ACTIVE' : 'OFF'}]`;
    }
    const viewport = this.container.querySelector('#expViewport');
    if (viewport) {
      viewport.classList.toggle('uv-mode', state.uvEnabled);
    }
    this.updateLighting();
  }

  showQuickInspectModal(clueId) {
    const clue = CLUES.find(c => c.id === clueId);
    if (!clue) return;

    const existing = document.getElementById('quickInspectModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'quickInspectModal';
    modal.className = 'quick-inspect-modal-overlay';
    modal.innerHTML = `
      <div class="quick-inspect-card ${state.uvEnabled ? 'uv-active' : ''}">
        <div class="inspect-card-header">
          <div class="inspect-badge-tag tag-${clue.category.toLowerCase()}">${clue.category} EVIDENCE</div>
          <button class="inspect-close-btn" id="btnCloseQuickInspect">&times;</button>
        </div>
        <h3 class="inspect-clue-title">${clue.title}</h3>
        <div class="inspect-clue-location">📍 ${clue.roomName} &bull; ${clue.dateStamp || 'Nov 14, 2009'}</div>
        
        <div class="inspect-clue-body">
          <p class="inspect-summary">${clue.summary}</p>
          <pre class="inspect-raw-preview">${(clue.content || clue.transcript || '').substring(0, 360)}${(clue.content || clue.transcript || '').length > 360 ? '...' : ''}</pre>
          ${clue.uvHiddenText ? `
            <div class="inspect-uv-preview ${state.uvEnabled ? 'revealed' : 'hidden'}">
              <span class="uv-label">⚡ UV CHEMICAL RESIDUE DETECTED:</span> ${clue.uvHiddenText}
            </div>
          ` : ''}
        </div>

        <div class="inspect-card-footer">
          <button class="btn-inspect-dossier" id="btnGoToFullDossier">📂 Open in Forensic Dossier</button>
          <button class="btn-inspect-pin" id="btnQuickPin">${state.pinnedClues.some(p => p.id === clue.id) ? '📌 Pinned on Board' : '📌 Pin to Board'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btnCloseQuickInspect').addEventListener('click', () => {
      sound.playClick();
      modal.remove();
    });

    modal.querySelector('#btnGoToFullDossier').addEventListener('click', () => {
      sound.playClick();
      modal.remove();
      if (this.onInspectClue) {
        this.onInspectClue(clueId);
      }
    });

    modal.querySelector('#btnQuickPin').addEventListener('click', (e) => {
      sound.playPinTap();
      if (state.pinnedClues.some(p => p.id === clue.id)) {
        state.unpinClueFromBoard(clue.id);
        e.target.textContent = '📌 Pin to Board';
      } else {
        state.pinClueToBoard(clue.id);
        e.target.textContent = '📌 Pinned on Board';
      }
    });
  }
}
