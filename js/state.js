// Bulletproof Game State Engine (Single Source of Truth) with Schema Validation,
// Migration, Anti-Cheat Prerequisite Verification, and Export/Import

import { CLUES, SUSPECTS, DEDUCTIONS, ENDINGS, CLUE_RELATIONSHIPS } from './data.js';

const STORAGE_KEY = 'MYSTERY_UNLOCKED_SAVE_V2';
const LEGACY_STORAGE_KEY = 'MYSTERY_UNLOCKED_SAVE_V1';
const CURRENT_SAVE_VERSION = 2;

class BulletproofGameState {
  constructor() {
    this.listeners = new Set();
    this.resetToDefaults();
    this.load();
  }

  resetToDefaults() {
    this.saveVersion = CURRENT_SAVE_VERSION;
    this.currentView = 'exploration'; // 'exploration' | 'board' | 'dossier' | 'interrogation' | 'deduction' | 'archive'
    this.currentRoomId = 'ROOM_OBSERVATION';
    this.uvEnabled = false;
    this.selectedClueId = 'CLUE_PERIMETER_FENCE';
    this.selectedSuspectId = 'SUSP_VANCE';
    this.activeAudio = null;
    
    // Accessibility & Settings
    this.isMuted = false;
    this.masterVolume = 0.8;
    this.reducedMotion = false;
    this.textScale = 'normal'; // 'normal' | 'large'
    this.hintIndex = 0; // 0, 1, 2 for progressive hints

    // Core progression
    this.discoveredClueIds = ['CLUE_PERIMETER_FENCE', 'CLUE_CAMERA_LOG', 'CLUE_TUNNEL_GRAFFITI', 'CLUE_13TH_FILE'];
    
    // Pinned clues on Corkboard
    this.pinnedClues = [
      { id: 'CLUE_CAMERA_LOG', x: 80, y: 90 },
      { id: 'CLUE_PERIMETER_FENCE', x: 260, y: 80 },
      { id: 'CLUE_TUNNEL_GRAFFITI', x: 100, y: 320 },
      { id: 'CLUE_13TH_FILE', x: 440, y: 220 }
    ];

    // Corkboard yarn connections with explicit relationship types & facts
    // Initial yarn: the canonically correct CONTRADICTION between camera cutoff and generator telemetry
    this.yarnConnections = [];
    // (Starting with no pre-drawn yarns — player draws their own connections)

    // Sticky Notes
    this.stickyNotes = [
      {
        id: 'NOTE_1',
        text: '11:42 PM\n- CAMERA OFF',
        x: 190,
        y: 10,
        color: '#ffea79'
      },
      {
        id: 'NOTE_2',
        text: 'ONE PERSON WAS\nNEVER THERE?',
        x: 40,
        y: 10,
        color: '#ffea79'
      },
      {
        id: 'NOTE_3',
        text: '12 MISSING.\nONE WAS NEVER\nTHERE.',
        x: 20,
        y: 450,
        color: '#ffea79'
      },
      {
        id: 'NOTE_4',
        text: 'FABRICATED IDENTITY?\nNO RECORD 2009',
        x: 320,
        y: 350,
        color: '#ffea79'
      }
    ];

    // Contradictions resolved: list of claimIds
    this.resolvedClaimIds = [];

    // Deductions status: map of deductionId -> { resolved: boolean, selectedOptionId: string, assignedClues: string[] }
    this.deductionsStatus = {};
    DEDUCTIONS.forEach(d => {
      this.deductionsStatus[d.id] = { resolved: false, selectedOptionId: null, assignedClues: [] };
    });

    // Chapter progression (1 through 5)
    this.currentChapter = 2;
    this.unlockedEndings = [];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.save();
    this.listeners.forEach(fn => {
      try {
        fn(event, payload, this);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    });
  }

  save() {
    try {
      const data = {
        saveVersion: CURRENT_SAVE_VERSION,
        timestamp: Date.now(),
        currentRoomId: this.currentRoomId,
        uvEnabled: this.uvEnabled,
        selectedClueId: this.selectedClueId,
        selectedSuspectId: this.selectedSuspectId,
        isMuted: this.isMuted,
        masterVolume: this.masterVolume,
        reducedMotion: this.reducedMotion,
        textScale: this.textScale,
        hintIndex: this.hintIndex,
        discoveredClueIds: this.discoveredClueIds,
        pinnedClues: this.pinnedClues,
        yarnConnections: this.yarnConnections,
        stickyNotes: this.stickyNotes,
        resolvedClaimIds: this.resolvedClaimIds,
        deductionsStatus: this.deductionsStatus,
        currentChapter: this.currentChapter,
        unlockedEndings: this.unlockedEndings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  load() {
    try {
      // 1. Try loading v2
      let saved = localStorage.getItem(STORAGE_KEY);
      
      // 2. Fallback to v1 legacy migration if v2 doesn't exist
      if (!saved) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          console.log('Migrating legacy save v1 to v2...');
          saved = this.migrateV1ToV2(legacy);
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        this.sanitizeAndApplyState(parsed);
      }
    } catch (e) {
      console.error('Failed to parse save file. Backing up corrupted save and resetting:', e);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(`${STORAGE_KEY}_CORRUPT_BACKUP_${Date.now()}`, raw);
      this.resetToDefaults();
    }
  }

  migrateV1ToV2(legacyJsonStr) {
    try {
      const v1 = JSON.parse(legacyJsonStr);
      const v2 = {
        saveVersion: 2,
        timestamp: Date.now(),
        ...v1,
        masterVolume: 0.8,
        reducedMotion: false,
        textScale: 'normal',
        hintIndex: 0
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v2));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return JSON.stringify(v2);
    } catch (err) {
      return null;
    }
  }

  sanitizeAndApplyState(data) {
    if (!data || typeof data !== 'object') return;

    // Sanitize discovered clues
    if (Array.isArray(data.discoveredClueIds)) {
      const validIds = new Set(CLUES.map(c => c.id));
      this.discoveredClueIds = data.discoveredClueIds.filter(id => validIds.has(id));
      if (!this.discoveredClueIds.includes('CLUE_13TH_FILE')) {
        this.discoveredClueIds.push('CLUE_13TH_FILE');
      }
    }

    // Sanitize pinned clues
    if (Array.isArray(data.pinnedClues)) {
      this.pinnedClues = data.pinnedClues.filter(p => p && p.id && typeof p.x === 'number' && typeof p.y === 'number');
    }

    // Sanitize yarn connections
    if (Array.isArray(data.yarnConnections)) {
      this.yarnConnections = data.yarnConnections.filter(y => y && y.fromId && y.toId);
    }

    // Sanitize stickies
    if (Array.isArray(data.stickyNotes)) {
      this.stickyNotes = data.stickyNotes.filter(n => n && n.id && n.text);
    }

    // Sanitize claims
    if (Array.isArray(data.resolvedClaimIds)) {
      this.resolvedClaimIds = data.resolvedClaimIds;
    }

    // Sanitize deductions
    if (data.deductionsStatus && typeof data.deductionsStatus === 'object') {
      DEDUCTIONS.forEach(d => {
        if (data.deductionsStatus[d.id]) {
          this.deductionsStatus[d.id] = data.deductionsStatus[d.id];
        }
      });
    }

    // Settings
    if (typeof data.isMuted === 'boolean') this.isMuted = data.isMuted;
    if (typeof data.masterVolume === 'number') this.masterVolume = Math.max(0, Math.min(1, data.masterVolume));
    if (typeof data.reducedMotion === 'boolean') this.reducedMotion = data.reducedMotion;
    if (data.textScale) this.textScale = data.textScale;
    if (typeof data.hintIndex === 'number') this.hintIndex = data.hintIndex;
    if (typeof data.currentChapter === 'number') this.currentChapter = Math.max(1, Math.min(5, data.currentChapter));
    if (Array.isArray(data.unlockedEndings)) this.unlockedEndings = data.unlockedEndings;
  }

  // Export & Import
  exportSaveData() {
    return JSON.stringify({
      saveVersion: CURRENT_SAVE_VERSION,
      timestamp: Date.now(),
      discoveredClueIds: this.discoveredClueIds,
      pinnedClues: this.pinnedClues,
      yarnConnections: this.yarnConnections,
      stickyNotes: this.stickyNotes,
      resolvedClaimIds: this.resolvedClaimIds,
      deductionsStatus: this.deductionsStatus,
      currentChapter: this.currentChapter,
      unlockedEndings: this.unlockedEndings
    }, null, 2);
  }

  importSaveData(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this.sanitizeAndApplyState(parsed);
      this.save();
      this.notify('SAVE_IMPORTED');
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Invalid save file JSON format.' };
    }
  }

  resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    this.resetToDefaults();
    this.save();
    this.notify('RESET_PROGRESS');
  }

  // Clue actions
  discoverClue(clueId) {
    if (!clueId) return false;
    const exists = CLUES.some(c => c.id === clueId);
    if (!exists) return false;

    if (!this.discoveredClueIds.includes(clueId)) {
      this.discoveredClueIds.push(clueId);
      
      // Auto pin to a slot on the board if not already pinned
      if (!this.pinnedClues.some(p => p.id === clueId)) {
        const index = this.pinnedClues.length;
        const col = index % 4;
        const row = Math.floor(index / 4);
        this.pinnedClues.push({
          id: clueId,
          x: 70 + col * 240,
          y: 70 + row * 220
        });
      }

      this.updateChapterProgression();
      this.notify('CLUE_DISCOVERED', { clueId });
      return true;
    }
    return false;
  }

  isClueDiscovered(clueId) {
    return this.discoveredClueIds.includes(clueId);
  }

  getDiscoveredClues() {
    return CLUES.filter(c => this.discoveredClueIds.includes(c.id));
  }

  // Board actions
  pinClueToBoard(clueId, x = 160, y = 160) {
    if (!this.pinnedClues.some(p => p.id === clueId)) {
      this.pinnedClues.push({ id: clueId, x, y });
      this.notify('CLUE_PINNED', { clueId });
    }
  }

  unpinClueFromBoard(clueId) {
    this.pinnedClues = this.pinnedClues.filter(p => p.id !== clueId);
    this.yarnConnections = this.yarnConnections.filter(y => y.fromId !== clueId && y.toId !== clueId);
    this.notify('CLUE_UNPINNED', { clueId });
  }

  updatePinPosition(clueId, x, y) {
    const pin = this.pinnedClues.find(p => p.id === clueId);
    if (pin) {
      pin.x = Math.round(x);
      pin.y = Math.round(y);
      this.notify('PIN_MOVED', { clueId, x: pin.x, y: pin.y });
    }
  }

  // Priority 2: Explicit Relationship Classification
  addYarnConnection(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return { success: false, reason: 'Invalid endpoints' };

    // Check if duplicate in either direction
    const alreadyConnected = this.yarnConnections.some(
      y => (y.fromId === fromId && y.toId === toId) || (y.fromId === toId && y.toId === fromId)
    );
    if (alreadyConnected) return { success: false, reason: 'Connection already exists.' };

    // Query explicit audited relationships
    const rel = CLUE_RELATIONSHIPS.find(
      r => (r.clueA === fromId && r.clueB === toId) || (r.clueA === toId && r.clueB === fromId)
    );

    const type = rel ? rel.type : 'LEAD';
    const fact = rel ? rel.factEstablished : 'Connection observed between case items.';
    const isContradiction = type === 'CONTRADICTION';

    const newYarn = {
      id: `YARN_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fromId,
      toId,
      type,
      isContradiction,
      factEstablished: fact
    };

    this.yarnConnections.push(newYarn);
    this.notify('YARN_ADDED', newYarn);
    return { success: true, yarn: newYarn };
  }

  removeYarnConnection(fromId, toId) {
    this.yarnConnections = this.yarnConnections.filter(
      y => !((y.fromId === fromId && y.toId === toId) || (y.fromId === toId && y.toId === fromId))
    );
    this.notify('YARN_REMOVED', { fromId, toId });
  }

  addStickyNote(text, x = 300, y = 200, color = '#ffea79') {
    const note = {
      id: `NOTE_${Date.now()}`,
      text: text || 'Observation...',
      x: Math.round(x),
      y: Math.round(y),
      color
    };
    this.stickyNotes.push(note);
    this.notify('STICKY_ADDED', note);
    return note;
  }

  updateStickyNote(id, text, x, y) {
    const note = this.stickyNotes.find(n => n.id === id);
    if (note) {
      if (text !== undefined) note.text = text;
      if (x !== undefined) note.x = Math.round(x);
      if (y !== undefined) note.y = Math.round(y);
      this.notify('STICKY_UPDATED', note);
    }
  }

  deleteStickyNote(id) {
    this.stickyNotes = this.stickyNotes.filter(n => n.id !== id);
    this.notify('STICKY_DELETED', { id });
  }

  // Interrogation & Contradictions
  resolveClaim(claimId, clueId) {
    let matchedClaim = null;
    for (const s of SUSPECTS) {
      const c = s.claims.find(claim => claim.id === claimId);
      if (c) {
        matchedClaim = c;
        break;
      }
    }

    if (!matchedClaim) return { success: false, reason: 'Invalid claim' };
    if (matchedClaim.counterClueId !== clueId) {
      return { success: false, reason: 'Evidence does not contradict this specific claim.' };
    }

    if (!this.resolvedClaimIds.includes(claimId)) {
      this.resolvedClaimIds.push(claimId);

      let unlockedClue = null;
      if (matchedClaim.unlockedEvidence) {
        unlockedClue = matchedClaim.unlockedEvidence;
        this.discoverClue(unlockedClue);
      }

      this.updateChapterProgression();
      this.notify('CLAIM_CONTRADICTED', { claimId, clueId, unlockedClue });
      return { success: true, unlockedClue };
    }

    return { success: true, alreadyResolved: true };
  }

  isClaimResolved(claimId) {
    return this.resolvedClaimIds.includes(claimId);
  }

  // Priority 1 & 2: Deductions & Rigorous Prerequisites
  setDeductionOption(deductionId, optionId) {
    if (this.deductionsStatus[deductionId]) {
      this.deductionsStatus[deductionId].selectedOptionId = optionId;
      this.notify('DEDUCTION_CHANGED', { deductionId, optionId });
    }
  }

  canAttemptDeduction(deductionId) {
    const ded = DEDUCTIONS.find(d => d.id === deductionId);
    if (!ded) return { allowed: false, reason: 'Unknown deduction' };

    const missingClues = ded.requiredClues.filter(cid => !this.isClueDiscovered(cid));
    if (missingClues.length > 0) {
      return {
        allowed: false,
        reason: `Missing required forensic clues (${missingClues.length} remaining).`
      };
    }

    const missingClaims = (ded.requiredClaims || []).filter(cid => !this.isClaimResolved(cid));
    if (missingClaims.length > 0) {
      return {
        allowed: false,
        reason: 'You must break the corresponding suspect testimony in interrogation first.'
      };
    }

    return { allowed: true };
  }

  validateDeduction(deductionId) {
    const target = DEDUCTIONS.find(d => d.id === deductionId);
    const status = this.deductionsStatus[deductionId];
    if (!target || !status) return { success: false, reason: 'Unknown deduction.' };

    const check = this.canAttemptDeduction(deductionId);
    if (!check.allowed) return { success: false, reason: check.reason };

    // Check required yarn board connections (Phase 2: requiredLinks prerequisite)
    if (target.requiredLinks && target.requiredLinks.length > 0) {
      const missingLinks = target.requiredLinks.filter(([clueA, clueB]) => {
        return !this.yarnConnections.some(
          y => (y.fromId === clueA && y.toId === clueB) || (y.fromId === clueB && y.toId === clueA)
        );
      });
      if (missingLinks.length > 0) {
        return {
          success: false,
          reason: `You must connect the required evidence on the Mystery Board first (${missingLinks.length} connection(s) missing).`
        };
      }
    }

    const correctOption = target.options.find(o => o.isCorrect);
    if (status.selectedOptionId !== correctOption.id) {
      return { success: false, reason: 'The hypothesis is logically flawed or contradicted by evidence.' };
    }

    status.resolved = true;
    this.updateChapterProgression();
    this.notify('DEDUCTION_RESOLVED', { deductionId });
    return { success: true, explanation: target.explanation };
  }

  // Priority 1: Anti-Cheat Ending Execution Validator
  canExecuteEnding(endingId) {
    const ending = ENDINGS[endingId];
    if (!ending) return { allowed: false, missingPrerequisites: ['Unknown ending identifier'] };

    const missing = [];

    // Check required deductions
    if (ending.requiredDeductions) {
      for (const did of ending.requiredDeductions) {
        if (!this.deductionsStatus[did]?.resolved) {
          const dObj = DEDUCTIONS.find(d => d.id === did);
          missing.push(`Deduction: "${dObj?.title || did}" not verified`);
        }
      }
    }

    // Check required claims
    if (ending.requiredClaims) {
      for (const cid of ending.requiredClaims) {
        if (!this.isClaimResolved(cid)) {
          missing.push(`Contradiction for claim "${cid}" not proven`);
        }
      }
    }

    // Check required clues
    if (ending.requiredClues) {
      for (const cid of ending.requiredClues) {
        if (!this.isClueDiscovered(cid)) {
          const cObj = CLUES.find(c => c.id === cid);
          missing.push(`Evidence: "${cObj?.title || cid}" not recovered`);
        }
      }
    }

    return {
      allowed: missing.length === 0,
      missingPrerequisites: missing
    };
  }

  executeEnding(endingId, inputCipher = null) {
    const ending = ENDINGS[endingId];
    if (!ending) return { success: false, error: 'Unknown ending' };

    // Check prerequisites first
    const check = this.canExecuteEnding(endingId);
    if (!check.allowed) {
      return {
        success: false,
        error: `Cannot execute indictment. Prerequisites missing:\n- ${check.missingPrerequisites.join('\n- ')}`
      };
    }

    // Check cipher requirement for Ending D
    if (ending.requiredCipher) {
      if ((inputCipher || '').trim().toUpperCase() !== ending.requiredCipher) {
        return { success: false, error: 'Invalid master override cipher.' };
      }
    }

    if (!this.unlockedEndings.includes(endingId)) {
      this.unlockedEndings.push(endingId);
    }
    this.notify('ENDING_UNLOCKED', { endingId });
    return { success: true, ending };
  }

  updateChapterProgression() {
    if (this.resolvedClaimIds.includes('CLAIM_VANCE_MIDNIGHT') && this.deductionsStatus['DED_SABOTAGE_TIMELINE']?.resolved) {
      this.currentChapter = Math.max(this.currentChapter, 3);
    }
    if (this.isClueDiscovered('CLUE_AUDIO_TAPE_CRUZ') && this.deductionsStatus['DED_COVERUP_FIRE']?.resolved) {
      this.currentChapter = Math.max(this.currentChapter, 4);
    }
    if (this.isClueDiscovered('CLUE_13TH_FILE') && this.isClueDiscovered('CLUE_PAYROLL_AUDIT') && this.deductionsStatus['DED_SUBJECT_13_IDENTITY']?.resolved) {
      this.currentChapter = Math.max(this.currentChapter, 5);
    }
  }
}

export const state = new BulletproofGameState();
