# MYSTERY UNLOCKED: The 13th File
### Interactive Investigation & Mystery Board Prototype

> *"Twelve people vanished. One person was never there. Find the thirteenth file before they find you."*

---

## 🎮 Prototype Overview

**Mystery Unlocked: The 13th File** is a psychological thriller investigation adventure prototype built as a high-fidelity vertical slice workstation.

### Key Features Implemented & Solvable:
1. **Interactive Facility Exploration**:
   - 4 Authentic 2009 Sub-Level 3 Rooms: **Security Hub**, **Cryo-Genomics Lab 03**, **Substation B Power Core**, and **Director's Vault**.
   - Dynamic flashlight beam with real-time cursor tracking & CRT retro monitor scanline toggle.
   - 16 Inspectable forensic hotspots with in-room quick examination modals.
2. **The Signature Mystery Board (Corkboard)**:
   - Genuine cork surface with realistic mahogany wood frame.
   - Pinned evidence cards with physical push pins.
   - **Interactive Red Yarn Tool**: Connect evidence pins with dynamic catenary tension strings.
   - **Contradiction Detection**: Clashing evidence triggers glowing neon crimson pulse cables with `⚡ CONTRADICTION` alerts.
   - Custom draggable sticky notes for personal player hypotheses.
3. **Forensic Evidence & UV Blacklight Lab**:
   - High-resolution document viewer with confidential government stamps.
   - **UV Blacklight Switch**: Reveals fluorescent purple/green concealed ink (forged coroner stamps, secret coordinates, memory overwrite logs).
   - **Cassette Tape Deck Module**: Animated spinning reels, audio waveform visualizer, and authentic 2009 recorded voice transcripts.
4. **Live Contradiction Engine**:
   - Interrogate key suspects: **Marcus Vance**, **Dr. Alistair Finch**, the **Official Inquest**, and the phantom **Dr. Paul Vance**.
   - Review statements and challenge claims directly using collected evidence.
   - Unlocks character breakdowns, panic confessions, and critical new forensic leads.
5. **Player-Led Deduction Matrix**:
   - Reconstruct the 3 core evidentiary pillars:
     - *Pillar 1: The Missing Hour & Premeditated Sabotage*
     - *Pillar 2: The Fire as a Mask for Whistleblower Murder*
     - *Pillar 3: The Secret of the 13th File & The Investigator's Identity*
   - Proof validation: Requires discovering and assigning physical evidence before accepting hypotheses.
6. **4 Distinct Endings & Secret Cypher**:
   - **Ending A**: The Official Patsy (Marcus Vance framed alone).
   - **Ending B**: The Whistleblower’s Shadow (Finch exposed, true 13th file secret buried).
   - **Ending C**: The 13th File Unlocked (**TRUE ENDING**: You are Subject Zero, synthetic amnesia shattered).
   - **Secret Ending D**: The Janus Global Awakening (Master Terminal Cypher: `JANUS-13-AWAKE`).
7. **The Unlocked Archive**:
   - 5-Chapter progression roadmap from *The Arrival* to *The Truth*.
   - Complete 12-personnel manifest table detailing official casualties vs 2026 uncovered reality.

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

*(Zero external npm dependencies required! Starts in <50ms using Node.js built-in HTTP server)*

---

## 📂 Project Architecture

```
MysteryUnlocked/
├── Docs/
│   ├── ENVIRONMENT_COMPATIBILITY_REPORT.md # Technical & platform environment assessment
│   ├── CASE_BIBLE.md                      # Complete 2009 narrative lore, suspects, and clues
│   └── TECHNICAL_ARCHITECTURE.md          # UE5 C++/Blueprint architecture & Data Asset schemas
├── css/
│   └── style.css                          # Complete forensic design system & CRT scanlines
├── js/
│   ├── app.js                             # Master coordinator & HUD manager
│   ├── audio.js                           # Web Audio API procedural synthesizer (ambient, tapes, pins)
│   ├── data.js                            # Narrative dataset (Rooms, Clues, Suspects, Endings)
│   ├── state.js                           # Reactive game state with LocalStorage persistence
│   ├── exploration.js                     # Flashlight & interactive room hotspot explorer
│   ├── mystery-board.js                   # Interactive corkboard with red yarn physics
│   ├── evidence-dossier.js                # Document reader, UV blacklight, and cassette player
│   ├── interrogation.js                   # Suspect claim contradictor & rebuttal dialogue
│   ├── deduction.js                       # Theory synthesizer & multiple endings engine
│   └── archive.js                         # Chapter progression & 12 personnel manifest
├── server.js                              # Zero-dependency local dev server
├── package.json                           # Scripts configuration
├── index.html                             # Semantic HTML5 workstation interface
└── README.md
```
