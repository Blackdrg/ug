# MYSTERY UNLOCKED: The 13th File
### Interactive Investigation & Mystery Board Prototype

> *"Twelve people vanished. One person was never there. Find the thirteenth file before they find you."*

---

## 🎮 Prototype Overview

**Mystery Unlocked: The 13th File** is a psychological thriller investigation adventure prototype built as a high-fidelity vertical slice workstation in vanilla modern web technologies (HTML5 / Vanilla CSS / ES2022 JavaScript, zero external npm dependencies).

### Key Features Implemented & Solvable:
1. **Interactive Facility Exploration**:
   - 4 Authentic 2009 Sub-Level 3 Rooms: **Observation Point 4 (Catwalk)**, **Flooded Drainage Culvert**, **Cryo-Genomics Lab 03**, and **Director's Vault**.
   - Dynamic flashlight beam with real-time cursor tracking & CRT retro monitor scanline toggle.
   - 17 inspectable forensic hotspots with in-room quick examination modals (including the critical Substation B Backup Generator Telemetry terminal).
2. **The Signature Mystery Board (Corkboard)**:
   - Genuine cork surface with realistic mahogany wood frame.
   - Pinned evidence cards with physical push pins.
   - **Interactive Red/Green/Amber Yarn Tool**: Connect evidence pins with dynamic catenary tension strings:
     - ⚡ **Red**: Contradiction
     - ✓ **Green**: Corroboration
     - 🔍 **Amber**: Lead / Association
   - Two-click yarn deletion mechanism with fact notifications.
   - Draggable customizable sticky notes and canonical suspect mugshots (**Marcus Vance**, **Dr. Aris Cross**, **Victor Kray**, **Anya Nova**, **Dr. Alistair Finch**, **Subject 13**).
3. **Forensic Evidence & UV Blacklight Lab**:
   - High-resolution document viewer with confidential government stamps.
   - **UV Blacklight Switch**: Reveals fluorescent purple/green concealed ink (forged coroner stamps, secret coordinates, memory overwrite logs).
   - **Cassette Tape Deck Module**: Animated spinning reels, audio waveform visualizer, and authentic 2009 recorded voice transcripts.
4. **Live Contradiction Engine**:
   - Interrogate key suspects: **Marcus Vance**, **Dr. Alistair Finch**, the **Official Inquest**, and the phantom **Dr. Paul Vance**.
   - Review statements and challenge claims directly using collected evidence.
   - Full keyboard accessibility (`Enter` / `Space` to challenge and present clues).
   - Unlocks character breakdowns, panic confessions, and critical new forensic leads.
5. **Player-Led Deduction Matrix**:
   - Data-driven hypothesis evaluation across 3 core evidentiary pillars:
     - *Pillar 1: The Missing Hour & Premeditated Sabotage*
     - *Pillar 2: The Fire as a Mask for Whistleblower Murder*
     - *Pillar 3: The Secret of the 13th File & The Investigator's Identity*
   - Proof validation: Requires discovering clues, breaking testimonies, and creating required board connections before deductions unlock.
6. **4 Distinct Endings & Secret Cipher**:
   - **Ending A**: The Official Patsy (Marcus Vance framed alone).
   - **Ending B**: The Whistleblower’s Shadow (Finch exposed, true 13th file secret buried).
   - **Ending C**: The 13th File Unlocked (**TRUE ENDING**: You are Subject Zero, synthetic amnesia shattered).
   - **Secret Ending D**: The Janus Global Awakening (Master Terminal Cipher: `JANUS-13-AWAKE`).
7. **The Unlocked Archive**:
   - 5-Chapter progression roadmap from *The Arrival* to *The Truth*.
   - Complete 12-personnel manifest table detailing official casualties vs 2026 uncovered reality.
8. **Live Investigation Clock & Accessibility Engine**:
   - Ticking real-time local investigation record clock in footer.
   - High-contrast text toggle, reduced motion toggle, master volume slider, and full audio mute.

---

## ⌨️ Controls & Keyboard Shortcuts

| Shortcut | Action |
|:---:|:---|
| <kbd>1</kbd> | Switch to **Facility Exploration** |
| <kbd>2</kbd> | Switch to **Mystery Board** |
| <kbd>3</kbd> | Switch to **Evidence Dossier** |
| <kbd>4</kbd> | Switch to **Interrogation Matrix** |
| <kbd>5</kbd> | Switch to **Deduction Matrix** |
| <kbd>6</kbd> | Switch to **Unlocked Archive** |
| <kbd>H</kbd> | Toggle **Progressive Hint System** |
| <kbd>M</kbd> | Toggle **Mute Audio** |
| <kbd>C</kbd> | Toggle **CRT Retro Scanlines** |
| <kbd>R</kbd> | Toggle **Reduced Motion Mode** |
| <kbd>Esc</kbd> | Dismiss modals, hints, and active dialogs |

---

## 🚀 How to Run Locally

```bash
# 1. From workspace root (c:\Users\mehta\Desktop\MU):
npm start
# OR:
node server.js
```

Open your browser at:  
👉 **`http://localhost:5173`**

Configurable environment port:
```bash
PORT=8080 node server.js
```

---

## 🧪 Automated Testing & Verification

The project includes automated headless tests validating game state, clue discovery, board links, contradiction checks, deduction validation, all 4 endings, and save/load serialization:

```bash
# Run 44-point headless test suite
npm test

# Run syntax check across all 11 JavaScript modules
npm run check
```

---

## 🕵️ Canonical Investigation Walkthrough (True Ending C & Secret Ending D)

1. **Phase 1: Facility Exploration**
   - In **Observation Point 4**: inspect Fence Point 4 (`CLUE_PERIMETER_FENCE`), Security Camera Node 04 (`CLUE_CAMERA_LOG`), CSO Vance's dropped pass (`CLUE_SECURITY_BADGE`), and catwalk graffiti (`CLUE_HANDWRITTEN_NOTE`).
   - In **Flooded Drainage Culvert**: inspect culvert graffiti (`CLUE_TUNNEL_GRAFFITI`), drainage pump log (`CLUE_MAINTENANCE_LOG`), charred fuse (`CLUE_BURNT_FUSE`), Thorne's micro-cassette (`CLUE_AUDIO_TAPE_THORNE`), and the backup generator terminal (`CLUE_GENERATOR_TELEMETRY`).
   - In **Cryo-Genomics Lab 03**: inspect Cryo-Pod 13 (`CLUE_CRYO_LOG`), coroner autopsy report (`CLUE_AUTOPSY_REPORT`), Dr. Cruz's tape (`CLUE_AUDIO_TAPE_CRUZ`), and the neural sync readout (`CLUE_NEURAL_READOUT`).
   - In **Director's Vault**: inspect the forged 13th file (`CLUE_13TH_FILE`), payroll ledger (`CLUE_PAYROLL_AUDIT`), Executive Directive #09 (`CLUE_JANUS_DIRECTIVE`), and Finch's confession tape (`CLUE_AUDIO_TAPE_FINCH`).

2. **Phase 2: Interrogation & Contradictions**
   - **Marcus Vance**: Challenge statement using `CLUE_CAMERA_LOG` (proves camera cut at 23:42, before blackout).
   - **The Official Inquest**: Challenge statement using `CLUE_AUTOPSY_REPORT` (proves victims died of cryogenic freezing, not flash burns).
   - **Dr. Paul Vance (Phantom)**: Challenge statement using `CLUE_PAYROLL_AUDIT` (proves zero records exist for Paul Vance).
   - **Dr. Alistair Finch**: Challenge statement using `CLUE_JANUS_DIRECTIVE` (proves Protocol OMEGA ordered arson).

3. **Phase 3: Mystery Board Connections**
   - Connect `CLUE_CAMERA_LOG` ↔ `CLUE_GENERATOR_TELEMETRY` (Contradiction).
   - Connect `CLUE_AUTOPSY_REPORT` ↔ `CLUE_BURNT_FUSE` (Contradiction).
   - Connect `CLUE_13TH_FILE` ↔ `CLUE_PAYROLL_AUDIT` (Contradiction).
   - Connect `CLUE_CRYO_LOG` ↔ `CLUE_NEURAL_READOUT` (Corroboration).

4. **Phase 4: Deduction Matrix & Endings**
   - **Pillar 1**: Select *"Marcus Vance manually killed cameras at 23:42 and ignited thermite to simulate a fire"* → Validate.
   - **Pillar 2**: Select *"To eliminate whistleblower Dr. Cruz and auditor Kray, masking cryogenic execution with arson"* → Validate.
   - **Pillar 3**: Select *"Paul Vance was a fake name created to mask Test Subject Zero (the player), whose mind was overwritten with an investigator persona"* → Validate.
   - **Trigger True Ending C**: Click **"EXECUTE TRUE INDICTMENT"** to reach *The 13th File Unlocked*.
   - **Trigger Secret Ending D**: Enter master override cipher `JANUS-13-AWAKE` in the terminal to reach *The Janus Global Awakening*.

---

## 📂 Project Structure

```
MysteryUnlocked/
├── Docs/
│   ├── CASE_BIBLE.md                      # Complete 2009 narrative lore, suspects, and clues
│   ├── ENVIRONMENT_COMPATIBILITY_REPORT.md # Technical & platform environment assessment
│   ├── TECHNICAL_ARCHITECTURE.md          # UE5 C++/Blueprint architecture & Data Asset schemas
│   └── VERIFICATION_REPORT.md             # Automated test results & audit log
├── css/
│   └── style.css                          # Complete forensic design system & CRT scanlines
├── js/
│   ├── app.js                             # Master coordinator, keyboard shortcuts & HUD manager
│   ├── audio.js                           # Web Audio API procedural synthesizer (ambient, tapes, pins)
│   ├── data.js                            # Audited narrative dataset (Rooms, Clues, Suspects, Endings)
│   ├── state.js                           # Reactive game state with LocalStorage persistence & schema guards
│   ├── exploration.js                     # Flashlight & interactive room hotspot explorer
│   ├── mystery-board.js                   # Interactive corkboard with red yarn physics & canonical mugshots
│   ├── evidence-dossier.js                # Document reader, UV blacklight, and cassette tape deck
│   ├── interrogation.js                   # Suspect claim contradictor & keyboard-accessible dialogue
│   ├── deduction.js                       # Data-driven theory matrix & multiple endings engine
│   └── archive.js                         # Chapter progression & 12 personnel manifest
├── test/
│   └── playthrough-test.js                # 44-point headless test suite
├── server.js                              # Zero-dependency local dev server
├── package.json                           # Scripts configuration
├── index.html                             # Semantic HTML5 workstation interface
├── .gitignore                             # Standard repository exclusion rules
└── README.md
```
