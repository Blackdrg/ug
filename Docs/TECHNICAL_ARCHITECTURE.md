# TECHNICAL ARCHITECTURE: MYSTERY UNLOCKED
**Engine:** Unreal Engine 5 (Target) & Reactive Web Vertical Slice  
**Architecture Style:** Data-Driven Case Model, Decoupled Contradiction Engine, UMG/Canvas Evidence System  

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------+
|                         PRESENTATION LAYER                            |
|  - First-Person Investigation Camera (UE5 / WebGL Canvas Viewport)   |
|  - UMG / CSS Glassmorphic Workstation UI                              |
|  - Draggable Mystery Corkboard with Physics Red String Cables         |
|  - Audio Tape Deck & Waveform Analyzer (Web Audio API / MetaSounds)   |
|  - UV Forensic Lamp & Document Magnification Lens                     |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    CORE INVESTIGATION FRAMEWORK                       |
|  - ClueManager (Evidence IDs, Discovered States, Redaction Masking)   |
|  - MysteryBoardController (Pin Coordinates, Yarn Edges, Contradictions)|
|  - InterrogationDirector (Dialogue Trees, Locked/Unlocked Branches)   |
|  - ForensicToolController (UV Fluorescent Overlays, Cipher Wheels)    |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                       CASE REASONING ENGINE                           |
|  - ContradictionMatrix: Compares Suspect Claims vs Evidence Attributes|
|  - DeductionValidator: Rule-based logic checking hypothesis validity   |
|  - TimelineSynthesizer: Chronological ordering of verified events     |
|  - ArchiveUnlockEvaluator: Progressive chapter gatekeeping (Ch 1 - 5) |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         PERSISTENCE & DATA                            |
|  - Case Definition Assets (JSON / UE5 DataTables)                     |
|  - SaveGame Subsystem (Local Storage / Unreal SaveGame binary)        |
|  - Journal & Audio Transcript Cache                                   |
+-----------------------------------------------------------------------+
```

---

## 2. Case Data Model & Clue Dependency Schema

```typescript
interface Clue {
  id: string;               // e.g., "CLUE_CAMERA_LOG_2342"
  title: string;
  category: 'DOCUMENT' | 'AUDIO' | 'PHOTO' | 'FORENSIC' | 'CIPHER';
  roomLocation: string;
  thumbnail: string;
  details: string;
  timestamp?: string;       // e.g., "2009-11-14 23:42"
  uvHiddenText?: string;    // Revealable under UV light
  contradictsClaimIds: string[]; // Claim IDs this clue invalidates
  leadsToDeductionId?: string;
}

interface SuspectClaim {
  id: string;               // e.g., "CLAIM_VANCE_MIDNIGHT"
  suspectId: string;        // "SUSP_VANCE"
  statement: string;
  status: 'UNCONTESTED' | 'CONTRADICTED' | 'CONFIRMED';
  refutingClueId: string;
  unlockedDialogueId?: string;
}

interface Deduction {
  id: string;               // e.g., "DED_FABRICATED_IDENTITY"
  title: string;
  requiredClueIds: string[]; // Set of clues player must pin & link
  hypothesisText: string;
  consequence: string;
  unlocksChapter: number;
}
```

---

## 3. Implementation Backlog & Verification Checklist

- [x] **Milestone 1: Architecture & Case Bible Specification** (Complete)
- [x] **Milestone 2: Responsive Frontend Workstation & Visual Theme** (Dark terminal, forensic glassmorphism, 1980s-2000s lab aesthetic)
- [x] **Milestone 3: Interactive First-Person Room Explorer** (Click-to-inspect 3D/canvas perspective with flashlight & interactive nodes)
- [x] **Milestone 4: Interactive Mystery Board** (Pins, red thread connections, auto-tension physics, sticky notes, contradiction alerts)
- [x] **Milestone 5: Contradiction Engine & Interrogation Matrix** (Presenting counter-evidence live to break suspect testimonies)
- [x] **Milestone 6: Forensic Tools** (UV blacklight switch, magnifying loupe, cassette tape deck with audio player)
- [x] **Milestone 7: Deduction Matrix & Endings** (Form hypotheses, submit case theory, unlock Chapter 4 "The 13th File" & Endings)
