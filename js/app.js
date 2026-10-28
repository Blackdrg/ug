// Master Application Coordinator & Accessibility Engine
import { state } from './state.js';
import { sound } from './audio.js';
import { HINTS } from './data.js';
import { ExplorationEngine } from './exploration.js';
import { MysteryBoard } from './mystery-board.js';
import { EvidenceDossier } from './evidence-dossier.js';
import { InterrogationEngine } from './interrogation.js';
import { DeductionMatrix } from './deduction.js';
import { ArchiveViewer } from './archive.js';

class MysteryApp {
  constructor() {
    this.mainViewContainer = document.getElementById('viewContainer');
    this.navBtns = document.querySelectorAll('.nav-tab-btn');
    this.statusCluesCount = document.getElementById('statusCluesCount');
    this.statusContradictions = document.getElementById('statusContradictions');
    this.statusChapter = document.getElementById('statusChapter');

    // Accessibility & Control Elements
    this.btnMute = document.getElementById('btnToggleMute');
    this.btnScanlines = document.getElementById('btnToggleScanlines');
    this.btnMotion = document.getElementById('btnToggleMotion');
    this.btnText = document.getElementById('btnToggleText');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.btnReset = document.getElementById('btnResetData');

    // Save Export / Import
    this.btnExportSave = document.getElementById('btnExportSave');
    this.btnImportTrigger = document.getElementById('btnImportSaveTrigger');
    this.fileImportSave = document.getElementById('fileImportSave');

    // Hint Modal Elements
    this.btnHint = document.getElementById('btnHint');
    this.hintModalOverlay = document.getElementById('hintModalOverlay');
    this.btnCloseHintModal = document.getElementById('btnCloseHintModal');
    this.btnCloseHintFooter = document.getElementById('btnCloseHintFooter');
    this.btnRevealTier2 = document.getElementById('btnRevealTier2');
    this.btnRevealTier3 = document.getElementById('btnRevealTier3');
    this.hintChapterBadge = document.getElementById('hintChapterBadge');
    this.hintTextTier1 = document.getElementById('hintTextTier1');
    this.hintTextTier2 = document.getElementById('hintTextTier2');
    this.hintTextTier3 = document.getElementById('hintTextTier3');

    // Modules
    this.views = {};

    this.init();
  }

  init() {
    // 1. Audio initialization on user interaction
    const audioInit = () => {
      sound.startAmbient();
      window.removeEventListener('click', audioInit);
      window.removeEventListener('keydown', audioInit);
    };
    window.addEventListener('click', audioInit);
    window.addEventListener('keydown', audioInit);

    // Apply saved accessibility preferences
    if (state.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      if (this.btnMotion) this.btnMotion.classList.add('active');
    }
    if (state.textScale === 'large') {
      document.documentElement.classList.add('text-enlarged');
      if (this.btnText) this.btnText.classList.add('active');
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = Math.round((state.masterVolume ?? 0.8) * 100);
      sound.setVolume(this.volumeSlider.value / 100);
    }

    // 2. Setup navigation tabs
    this.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const targetView = btn.dataset.view;
        this.switchView(targetView);
      });
    });

    // 3. Audio Mute button
    if (this.btnMute) {
      this.btnMute.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        this.btnMute.classList.toggle('muted', isMuted);
        this.btnMute.innerHTML = isMuted ? '🔇 <span class="nav-text">MUTED</span>' : '🔊 <span class="nav-text">AUDIO</span>';
      });
    }

    // 4. Volume slider
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        sound.setVolume(val);
        state.masterVolume = val;
        state.save();
      });
    }

    // 5. Scanlines toggle
    if (this.btnScanlines) {
      this.btnScanlines.addEventListener('click', () => {
        sound.playClick();
        document.body.classList.toggle('crt-scanlines');
      });
    }

    // 6. Reduced Motion toggle (Priority 4 Accessibility)
    if (this.btnMotion) {
      this.btnMotion.addEventListener('click', () => {
        sound.playClick();
        const active = document.documentElement.classList.toggle('reduced-motion');
        this.btnMotion.classList.toggle('active', active);
        state.reducedMotion = active;
        state.save();
        this.showToastNotification(active ? '⚡ Reduced motion enabled' : '⚡ Motion animations restored');
      });
    }

    // 7. Typography size toggle (Priority 4 Accessibility)
    if (this.btnText) {
      this.btnText.addEventListener('click', () => {
        sound.playClick();
        const active = document.documentElement.classList.toggle('text-enlarged');
        this.btnText.classList.toggle('active', active);
        state.textScale = active ? 'large' : 'normal';
        state.save();
        this.showToastNotification(active ? '🔤 Large text mode enabled' : '🔤 Standard typography restored');
      });
    }

    // 8. Progressive Hint Dialog (Priority 4)
    if (this.btnHint) {
      this.btnHint.addEventListener('click', () => {
        sound.playClick();
        this.toggleHintModal();
      });
    }
    if (this.btnCloseHintModal) {
      this.btnCloseHintModal.addEventListener('click', () => this.closeHintModal());
    }
    if (this.btnCloseHintFooter) {
      this.btnCloseHintFooter.addEventListener('click', () => this.closeHintModal());
    }
    if (this.btnRevealTier2) {
      this.btnRevealTier2.addEventListener('click', () => {
        sound.playClick();
        this.revealHintTier(2);
      });
    }
    if (this.btnRevealTier3) {
      this.btnRevealTier3.addEventListener('click', () => {
        sound.playClick();
        this.revealHintTier(3);
      });
    }

    // 9. Save Export & Import (Priority 6)
    if (this.btnExportSave) {
      this.btnExportSave.addEventListener('click', () => {
        sound.playClick();
        this.exportSaveFile();
      });
    }
    if (this.btnImportTrigger && this.fileImportSave) {
      this.btnImportTrigger.addEventListener('click', () => {
        sound.playClick();
        this.fileImportSave.click();
      });
      this.fileImportSave.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = state.importSaveData(event.target.result);
          if (res.success) {
            this.showToastNotification('✓ Save file restored successfully!');
            this.updateHUD();
            this.switchView(state.currentView || 'exploration');
          } else {
            alert(`Save Import Failed: ${res.error}`);
          }
        };
        reader.readAsText(file);
      });
    }

    // 10. Reset button with safe backup
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => {
        if (confirm('Reset investigation progress and start from initial evidence? (A backup of your previous save will be retained)')) {
          sound.playClick();
          state.resetProgress();
          location.reload();
        }
      });
    }

    // 11. Global Keyboard Navigation (Priority 4)
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in an input, textarea, or contenteditable
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') target.blur();
        return;
      }

      // Escape closes open modals
      if (e.key === 'Escape') {
        const quickInspect = document.getElementById('quickInspectModal');
        if (quickInspect && quickInspect.style.display !== 'none') {
          quickInspect.style.display = 'none';
          return;
        }
        if (this.hintModalOverlay && this.hintModalOverlay.style.display !== 'none') {
          this.closeHintModal();
          return;
        }
      }

      // Number keys 1-6 switch views
      switch (e.key) {
        case '1':
          this.switchView('exploration');
          break;
        case '2':
          this.switchView('board');
          break;
        case '3':
          this.switchView('dossier');
          break;
        case '4':
          this.switchView('interrogation');
          break;
        case '5':
          this.switchView('deduction');
          break;
        case '6':
          this.switchView('archive');
          break;
        case 'h':
        case 'H':
          this.toggleHintModal();
          break;
        case 'm':
        case 'M':
          if (this.btnMute) this.btnMute.click();
          break;
        case 'c':
        case 'C':
          if (this.btnScanlines) this.btnScanlines.click();
          break;
        case 'r':
        case 'R':
          if (this.btnMotion) this.btnMotion.click();
          break;
      }
    });

    // 12. Subscribe to state changes
    state.subscribe((event, payload) => {
      this.updateHUD();
      if (event === 'CLUE_DISCOVERED') {
        this.showToastNotification(`New Evidence Recovered: ${payload.clueId}`);
      } else if (event === 'CLAIM_CONTRADICTED') {
        this.showToastNotification(`⚡ Contradiction Verified! Suspect testimony broken.`);
      } else if (event === 'DEDUCTION_RESOLVED') {
        this.showToastNotification(`✓ Pillar Deduction Proven! New lead unlocked.`);
      } else if (event === 'ENDING_UNLOCKED') {
        this.showToastNotification(`★ Case Indictment Concluded!`);
      }
    });

    // Initial view
    this.switchView(state.currentView || 'exploration');
    this.updateHUD();
  }

  updateHUD() {
    const discovered = state.discoveredClueIds.length;
    if (this.statusCluesCount) this.statusCluesCount.textContent = `${discovered} / 16`;
    if (this.statusContradictions) this.statusContradictions.textContent = `${state.resolvedClaimIds.length} / 4`;
    if (this.statusChapter) this.statusChapter.textContent = `CH 0${state.currentChapter}`;
  }

  switchView(viewName) {
    state.currentView = viewName;
    this.navBtns.forEach(b => b.classList.toggle('active', b.dataset.view === viewName));

    this.mainViewContainer.innerHTML = '';
    const viewWrapper = document.createElement('div');
    viewWrapper.className = `view-page view-${viewName}`;
    this.mainViewContainer.appendChild(viewWrapper);

    switch (viewName) {
      case 'exploration':
        this.views.exploration = new ExplorationEngine(viewWrapper, (clueId) => {
          this.switchView('dossier');
          this.views.dossier?.showClue(clueId);
        });
        break;

      case 'board':
        this.views.board = new MysteryBoard(viewWrapper, (clueId) => {
          this.switchView('dossier');
          this.views.dossier?.showClue(clueId);
        });
        break;

      case 'dossier':
        this.views.dossier = new EvidenceDossier(viewWrapper, (claimId, clueId) => {
          this.switchView('interrogation');
          this.views.interrogation?.setFocusClaim(claimId);
        });
        break;

      case 'interrogation':
        this.views.interrogation = new InterrogationEngine(viewWrapper, (unlockedClueId) => {
          // Callback when new clue unlocked
        });
        break;

      case 'deduction':
        this.views.deduction = new DeductionMatrix(viewWrapper);
        break;

      case 'archive':
        this.views.archive = new ArchiveViewer(viewWrapper);
        break;
    }
  }

  // Progressive Hint Dialog Logic (Priority 4)
  toggleHintModal() {
    if (!this.hintModalOverlay) return;
    const isVisible = this.hintModalOverlay.style.display !== 'none';
    if (isVisible) {
      this.closeHintModal();
    } else {
      this.openHintModal();
    }
  }

  openHintModal() {
    if (!this.hintModalOverlay) return;
    const ch = state.currentChapter || 2;
    if (this.hintChapterBadge) this.hintChapterBadge.textContent = `CH 0${ch}`;

    const hintData = HINTS.find(h => h.chapter === ch) || HINTS[0];

    // Tier 1 is always available
    if (this.hintTextTier1) {
      this.hintTextTier1.textContent = hintData.level1;
    }

    // Reset Tier 2 & 3 unless previously revealed in this session
    if (!this.revealedTier2) {
      if (this.hintTextTier2) {
        this.hintTextTier2.textContent = 'Click "Reveal Tier 2" to uncover corroboration and contradiction guidance.';
        this.hintTextTier2.classList.add('locked');
      }
      if (this.btnRevealTier2) this.btnRevealTier2.style.display = 'inline-block';
    } else {
      this.revealHintTier(2);
    }

    if (!this.revealedTier3) {
      if (this.hintTextTier3) {
        this.hintTextTier3.textContent = 'Click "Reveal Tier 3" for explicit forensic action steps.';
        this.hintTextTier3.classList.add('locked');
      }
      if (this.btnRevealTier3) this.btnRevealTier3.style.display = 'inline-block';
    } else {
      this.revealHintTier(3);
    }

    this.hintModalOverlay.style.display = 'flex';
  }

  closeHintModal() {
    if (this.hintModalOverlay) {
      this.hintModalOverlay.style.display = 'none';
    }
  }

  revealHintTier(tier) {
    const ch = state.currentChapter || 2;
    const hintData = HINTS.find(h => h.chapter === ch) || HINTS[0];

    if (tier === 2) {
      this.revealedTier2 = true;
      if (this.hintTextTier2) {
        this.hintTextTier2.textContent = hintData.level2;
        this.hintTextTier2.classList.remove('locked');
      }
      if (this.btnRevealTier2) this.btnRevealTier2.style.display = 'none';
    } else if (tier === 3) {
      this.revealedTier3 = true;
      if (this.hintTextTier3) {
        this.hintTextTier3.textContent = hintData.level3;
        this.hintTextTier3.classList.remove('locked');
      }
      if (this.btnRevealTier3) this.btnRevealTier3.style.display = 'none';
    }
  }

  // Export Save File as JSON (Priority 6)
  exportSaveFile() {
    const jsonStr = state.exportSaveData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mystery_unlocked_save_ch${state.currentChapter}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToastNotification('💾 Save file exported successfully!');
  }

  showToastNotification(message) {
    let toast = document.getElementById('gameToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gameToast';
      toast.className = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

// Bootstrap once DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new MysteryApp();
});
