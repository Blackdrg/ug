// Master Narrative Dataset & Audited Case Universe: Mystery Unlocked - The 13th File
// Rigorously audited timestamps, alibis, evidence relationships, and deduction dependency graph.

export const TIMELINE_EVENTS = [
  { time: '2009-11-10 14:00', event: "Director Finch issues Executive Directive #09 (Protocol OMEGA: Termination & Persona Overwrite)." },
  { time: '2009-11-12 11:30', event: "External Auditor Victor Kray identifies $42M ghost embezzlement and zero payroll records for Paul Vance." },
  { time: '2009-11-14 22:40', event: "Janus EEG trial #44 grafts 'Investigator Julian Ward' archetype onto Test Subject Zero." },
  { time: '2009-11-14 22:50', event: "Maya Lin records memo confirming bio-containment sensors are flat; Finch is locking staff in." },
  { time: '2009-11-14 23:10', event: "Corridor standoff polaroid: Cruz clutching tape reel, confronted by Finch with pneumatic sedative." },
  { time: '2009-11-14 23:25', event: "Dr. Elena Cruz hides micro-cassette SOS in ventilation shaft before cryo-lockdown." },
  { time: '2009-11-14 23:30', event: "Head Archivist Rachel Foster forced under duress to forge 'Dr. Paul Vance' personnel file." },
  { time: '2009-11-14 23:42', event: "Marcus Vance uses terminal SEC-01 to execute manual blackout of surveillance Node 04." },
  { time: '2009-11-14 23:45', event: "Culvert graffiti 'THEY ARE NOT GOING TO LET US OUT - 13' inscribed above drainage waterline." },
  { time: '2009-11-14 23:50', event: "Chief Engineer Thorne logs Vance carrying thermite charges into transformer corridor." },
  { time: '2009-11-14 23:55', event: "Cryo-Pod 13 registers 40Hz Gamma sync bio-signature of human Subject Zero." },
  { time: '2009-11-14 23:59', event: "Main grid tripped manually; Auxiliary Turbine 3 auto-engages, maintaining uninterrupted 220V." },
  { time: '2009-11-15 00:00', event: "Thermite ignited inside Breaker Panel 4B to simulate arc flash and seal lower dampers." },
  { time: '2009-11-15 00:14', event: "Pod 13 emergency release valve tripped by external bypass key." },
  { time: '2009-11-15 00:28', event: "Perimeter fence point 4 cut from inside; Subject Zero flees into winter wilderness." },
  { time: '2009-11-15 01:20', event: "Director Finch records confession tape acknowledging Pod 13 subject escaped." },
  { time: '2026-10-28 23:00', event: "Investigator Julian Ward receives encrypted drive and enters Blackwood Sub-Level 3." }
];

export const ROOMS = [
  {
    id: 'ROOM_OBSERVATION',
    name: 'Observation Point 4 (Catwalk)',
    subtitle: 'Perimeter catwalk, optical spotting scope, and facility boundary fence',
    ambientColor: '#0a1624',
    viewMode: 'optical_deck',
    narration: 'INVESTIGATOR: "The gate wasn\'t broken by intruders from the outside... This was an exit. Someone fled the facility in a hurry."',
    description: 'Rain lashes against the rusted iron catwalk overlooking the perimeter fence. High-voltage searchlights pierce through the mist.',
    clueIds: ['CLUE_PERIMETER_FENCE', 'CLUE_CAMERA_LOG', 'CLUE_SECURITY_BADGE', 'CLUE_HANDWRITTEN_NOTE']
  },
  {
    id: 'ROOM_DRAINAGE',
    name: 'Flooded Drainage Culvert',
    subtitle: 'Sub-Level 3 drainage pipeline, waterline graffiti, and emergency runoff',
    ambientColor: '#071618',
    viewMode: 'lantern_tunnel',
    narration: 'INVESTIGATOR: "The official records show these tunnels were sealed before the fire... but these doors were forced open from the inside. They tried to escape through here."',
    description: 'Waist-deep black water rushes through rusted sewer conduits. A brass storm lantern casts long quivering shadows across crimson wall graffiti: "THEY ARE NOT GOING TO LET US OUT - 13".',
    clueIds: ['CLUE_TUNNEL_GRAFFITI', 'CLUE_MAINTENANCE_LOG', 'CLUE_BURNT_FUSE', 'CLUE_AUDIO_TAPE_THORNE']
  },
  {
    id: 'ROOM_LAB',
    name: 'Cryo-Genomics Lab 03',
    subtitle: 'Neural sync tanks, cryo-containment pods, and telemetry racks',
    ambientColor: '#081717',
    viewMode: 'lab_interior',
    narration: 'INVESTIGATOR: "Twelve cryogenic pods purged to zero... but Pod 13 registered active brainwaves until midnight. Who was in that pod?"',
    description: 'The epicenter of Project Janus. Shuttered cryo-capsules line the frosted chamber. Liquid nitrogen valves hiss intermittently into the darkness.',
    clueIds: ['CLUE_CRYO_LOG', 'CLUE_AUTOPSY_REPORT', 'CLUE_AUDIO_TAPE_CRUZ', 'CLUE_NEURAL_READOUT']
  },
  {
    id: 'ROOM_ARCHIVE',
    name: "Director's Vault & Cold Archives",
    subtitle: 'Sealed filing cabinets, pneumatic dispatch, and biometric terminal',
    ambientColor: '#140c17',
    viewMode: 'vault_archive',
    narration: 'INVESTIGATOR: "A forged personnel dossier tucked behind steel blast-doors. Finch thought nobody would ever come back here."',
    description: 'A subterranean archive protected by heavy blast-doors. Stacks of water-damaged manila folders and locked safety-deposit lockers.',
    clueIds: ['CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT', 'CLUE_JANUS_DIRECTIVE', 'CLUE_AUDIO_TAPE_FINCH']
  }
];

export const CLUES = [
  {
    id: 'CLUE_PERIMETER_FENCE',
    title: 'Perimeter Fence Breach (Point 4)',
    category: 'FORENSIC',
    roomId: 'ROOM_OBSERVATION',
    roomName: 'Observation Point 4 (Catwalk)',
    dateStamp: 'Nov 15, 2009 - 00:28',
    summary: 'Heavy chain-link fence cut from the inside outward. Snagged threads of white sterile clean-room fabric remain tangled on the razor wire.',
    content: `OBSERVATION POINT 4 - PERIMETER BREACH REPORT:
Location: North-West Perimeter Boundary (Grid 04)
Observation: The chain-link gate was severed with industrial pneumatic shears. Wire burrs and fence distortion prove conclusively that the cut originated from INSIDE the facility.
Evidence: Fragment of sterile Nomex lab-suit snagged on barbed strand.
Investigator Deduction: "The gate wasn't broken by intruders from the outside... This was an exit. Someone fled the facility in a hurry."`,
    uvHiddenText: 'UV FLUORESCENCE: Footprint in muddy runoff under fence measures boot size 9.5 (Matches Investigator Julian Ward).',
    contradictsClaimId: null,
    supportsDeduction: 'DED_SABOTAGE_TIMELINE',
    tags: ['Perimeter', 'Escape', 'Observation Point 4']
  },
  {
    id: 'CLUE_TUNNEL_GRAFFITI',
    title: 'Culvert Wall Graffiti: "THEY ARE NOT GOING TO LET US OUT - 13"',
    category: 'PHOTO',
    roomId: 'ROOM_DRAINAGE',
    roomName: 'Flooded Drainage Culvert',
    dateStamp: 'Nov 14, 2009 - 23:45',
    summary: 'Distress warning painted in dried bio-luminescent red dye on the reinforced concrete drainage wall above the waterline.',
    content: `SUB-LEVEL 3 DRAINAGE SECTOR RUNOFF:
Wall Inscription: "THEY ARE NOT GOING TO LET US OUT - 13"
Medium: High-viscosity cryogenic marking dye mixed with blood.
Physical State: Heavy iron blast-doors at the culvert head were manually forced open with an iron pry-bar from inside the facility.
Investigator Note: "Official records claimed these tunnels were sealed long before the fire. They tried to escape through here."`,
    uvHiddenText: 'UV FLUORESCENCE: Below the "13", faint writing in Dr. Cruz\'s hand: "FINCH LOCKED THE VENTS".',
    contradictsClaimId: 'CLAIM_FIRE_CAUSE',
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Culvert', 'Graffiti', 'Escape Attempt']
  },
  {
    id: 'CLUE_CAMERA_LOG',
    title: 'Surveillance Node #04 Cutoff Log',
    category: 'FORENSIC',
    roomId: 'ROOM_OBSERVATION',
    roomName: 'Observation Point 4 (Catwalk)',
    dateStamp: 'Nov 14, 2009 - 23:42:18',
    summary: 'Automated video buffer report showing Node 04 (Hallway leading to Lab 03) abruptly cut off by manual administrative command, exactly 18 minutes before the supposed midnight blackout.',
    content: `[BLACKWOOD SECURITY NODE 04 TELEMETRY]
TIMESTAMP: 2009-11-14 23:42:18 EST
STATUS: VIDEO STREAM TERMINATED
OVERRIDE ORIGIN: Physical Terminal SEC-01 (Security Hub)
OPERATOR CREDENTIAL: [CHIEF-VANCE-770]
COMMAND: 'FORCE_STOP_STREAM --all-corridors --no-failover'

NOTE: No electrical fault detected. Manual disconnect initiated.`,
    uvHiddenText: 'UV FLUORESCENCE: Terminal keyboard was wiped with industrial isopropyl alcohol at 23:45.',
    contradictsClaimId: 'CLAIM_VANCE_MIDNIGHT',
    supportsDeduction: 'DED_SABOTAGE_TIMELINE',
    tags: ['Surveillance', 'Timestamp', 'Marcus Vance']
  },
  {
    id: 'CLUE_SECURITY_BADGE',
    title: "Cracked Master Keycard (CSO Vance)",
    category: 'PHOTO',
    roomId: 'ROOM_OBSERVATION',
    roomName: 'Observation Point 4 (Catwalk)',
    dateStamp: 'Nov 14, 2009 - 23:42',
    summary: 'Heavy RFID security pass belonging to Marcus Vance, retrieved from under the broken server rack. Backplate magnetic strip melted.',
    content: `NAME: Marcus Vance
POSITION: Chief Security Officer (Level 5 Clearance)
SERIAL: BK-09-9941
EMERGENCY OVERRIDE: AUTHORIZED

Forensic observation: Keycard shows dried contact burns on copper pins, indicating intentional short-circuiting into the master lock controller to seal Sub-Level 3 from the inside.`,
    uvHiddenText: 'UV FLUORESCENCE: Blood droplet on lanyard matches blood type O-Negative (Chief Vance).',
    contradictsClaimId: null,
    supportsDeduction: 'DED_SABOTAGE_TIMELINE',
    tags: ['Physical Evidence', 'Access Control']
  },
  {
    id: 'CLUE_HANDWRITTEN_NOTE',
    title: 'Torn Memo on Security Desk',
    category: 'DOCUMENT',
    roomId: 'ROOM_OBSERVATION',
    roomName: 'Observation Point 4 (Catwalk)',
    dateStamp: 'Nov 14, 2009 - 22:50',
    summary: 'A scrawled yellow notepad paper found tucked inside the station logbook, written in hasty, trembling handwriting.',
    content: `"Finch told me to lock the blast doors at 23:30. He said the containment seal was leaking. But I checked the bio-sensors—they're completely flat! He isn't locking something out. He's locking Elena in. If anyone finds this: check the auxiliary freezer vents." - Signed: 'M.L.' (Maya Lin)`,
    uvHiddenText: 'UV FLUORESCENCE: "Do not let Vance see you read this."',
    contradictsClaimId: null,
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Document', 'Whistleblower', 'Maya Lin']
  },
  {
    id: 'CLUE_CRYO_LOG',
    title: 'Cryo-Pod Telemetry Log #13',
    category: 'DOCUMENT',
    roomId: 'ROOM_LAB',
    roomName: 'Cryo-Genomics Lab 03',
    dateStamp: 'Nov 14, 2009 - 23:55:02',
    summary: 'Automated cryogenic chamber vitals printout. Pod 01 through 12 are marked VACANT. Pod 13 registered an active human bio-signature until 00:14:52.',
    content: `[PROJECT JANUS - CRYO CHAMBER ARRAY]
Chambers 01 - 12: DECOMMISSIONED / PURGED
Chamber 13: ACTIVE STATUS
SUBJECT IDENTIFIER: 'SUBJECT 0-ZERO'
CORE BODY TEMP: 18.4°C (HYPOTHERMIC PRESERVATION)
NEURAL FREQUENCY: 40 Hz (GAMMA SYNC - FORCED MEMORY IMPRINT)
EMERGENCY RELEASE TRIGGERED: 00:14:52 BY EXTERNAL BYPASS KEY.

CONCLUSION: There was never an employee named Paul Vance inside Pod 13. Pod 13 held an experimental neural-graft subject.`,
    uvHiddenText: 'UV FLUORESCENCE: SUBJECT BIOMETRICS MATCH: INVESTIGATOR JULIAN WARD.',
    contradictsClaimId: 'CLAIM_PAUL_VANCE_EMPLOYEE',
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['Cryogenics', 'Subject Zero', 'Medical']
  },
  {
    id: 'CLUE_AUTOPSY_REPORT',
    title: 'Preliminary Inquest Body Examination',
    category: 'FORENSIC',
    roomId: 'ROOM_LAB',
    roomName: 'Cryo-Genomics Lab 03',
    dateStamp: 'Nov 20, 2009',
    summary: 'County coroner autopsy report for victim recovered from Lab 03. Officially classified as "death by fire thermal shock".',
    content: `INQUEST REPORT NO. 2009-881:
OFFICIAL CAUSE: "Third-degree full-body thermal trauma caused by substation arc flash fire."

FORENSIC PATHOLOGIST CONFIDENTIAL DISSENT:
"The tissue damage shows extensive cellular freeze-fracture and cyanotic crystallization consistent with instantaneous exposure to -180°C liquid nitrogen, followed by a localized surface incendiary grenade used to mask the true cause of death."`,
    uvHiddenText: 'UV FLUORESCENCE: Signature of Chief Coroner has been forged using a rubberized transfer stamp.',
    contradictsClaimId: 'CLAIM_FIRE_CAUSE',
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Forensic', 'Pathology', 'Cover-up']
  },
  {
    id: 'CLUE_AUDIO_TAPE_CRUZ',
    title: "Micro-Cassette: Dr. Elena Cruz's SOS",
    category: 'AUDIO',
    roomId: 'ROOM_LAB',
    roomName: 'Cryo-Genomics Lab 03',
    dateStamp: 'Nov 14, 2009 - 23:25',
    summary: 'Recovered from the air vent exhaust grill in Lab 03. The tape is warped by heat but clearly audible.',
    audioDuration: '00:48',
    transcript: `[STATIC HISS... LAB VENTILATION HUM IN BACKGROUND]
CRUZ: (Whispering, panicked) "If this reaches the review board... Finch has gone completely insane. The grant was pulled three weeks ago because of human experimentation violations. He didn't stop. He wiped Subject Zero's mind and began writing a fabricated past onto the neural lattice! 
He told Marcus that the auditor Victor Kray had to be silenced. They're going to burn Sub-Level 3 and blame an electrical catastrophe! They created a phantom profile on the roster—'Paul Vance'—to cover up the missing subject body in Pod 13! God, someone's at the blast door—"
[LOUD METALLIC CLANG... MUFFLED SHOUTS... TAPE CUTS OFF]`,
    uvHiddenText: 'UV FLUORESCENCE: Cassette casing marked with coordinates: "42.881° N, 71.450° W - Safehouse".',
    contradictsClaimId: 'CLAIM_PAUL_VANCE_EMPLOYEE',
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['Audio Tape', 'Elena Cruz', 'Project Janus']
  },
  {
    id: 'CLUE_NEURAL_READOUT',
    title: 'Janus EEG Neural Mapping Printout',
    category: 'DOCUMENT',
    roomId: 'ROOM_LAB',
    roomName: 'Cryo-Genomics Lab 03',
    dateStamp: 'Nov 14, 2009 - 22:40',
    summary: 'Continuous paper chart recording brainwave activity during synthetic memory graft trial #44.',
    content: `PROJECT JANUS - SYNTHETIC MEMORY IMPLANT #44
SOURCE MEMORY: "Investigator / Detective persona profile - Julian Ward"
TARGET: Test Subject Zero (Age 24, male, acute retro-amnesia)
REWRITING INTEGRITY: 89.4%
FLASHBACK PROBABILITY: High upon returning to physical trigger environment (Blackwood Sub-Level 3).

NOTE BY DR. FINCH: "If the subject awakens without reinforcement, memory dissonance will cause severe disorientation."`,
    uvHiddenText: 'UV FLUORESCENCE: "YOU WERE NEVER HIRED AS AN INVESTIGATOR. YOU ARE THE EXPERIMENT."',
    contradictsClaimId: null,
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['Medical', 'Identity', 'Twist']
  },
  {
    id: 'CLUE_GENERATOR_TELEMETRY',
    title: 'Substation B Backup Generator Log',
    category: 'DOCUMENT',
    roomId: 'ROOM_DRAINAGE',
    roomName: 'Flooded Drainage Culvert',
    dateStamp: 'Nov 14-15, 2009',
    summary: 'Continuous digital logger recording voltage in Sub-Level 3 between 22:00 and 03:00.',
    content: `[SUBSTATION B TELEMETRY ARCHIVE]
22:00 - 23:40: Main Grid 480V AC (Nominal)
23:42: Surveillance Subsystem disconnect (Manual breaker trip)
23:59: Main Grid Disconnect (Manual switch)
00:00: Emergency Auxiliary Turbine #3: AUTO-STARTED (UNINTERRUPTED 220V)
00:00 - 02:30: Continuous power delivered to Cryo-Array and Blast Door Magnets.

FINDING: The power never failed! Sub-Level 3 had continuous uninterruptible electrical current until 02:30 AM.`,
    uvHiddenText: 'UV FLUORESCENCE: Terminal signed off by Samuel Thorne: "Someone tampered with the auto-fire suppression lines."',
    contradictsClaimId: 'CLAIM_VANCE_MIDNIGHT',
    supportsDeduction: 'DED_SABOTAGE_TIMELINE',
    tags: ['Power', 'Telemetry', 'Contradiction']
  },
  {
    id: 'CLUE_BURNT_FUSE',
    title: 'Thermite Residue on Circuit Breaker 4B',
    category: 'FORENSIC',
    roomId: 'ROOM_DRAINAGE',
    roomName: 'Flooded Drainage Culvert',
    dateStamp: 'Nov 14, 2009 - 23:59',
    summary: 'Shattered porcelain high-voltage fuse with distinctive silvery metallic crust and sulfur aroma.',
    content: `FORENSIC ANALYSIS:
Residue contains aluminum powder and iron oxide (Thermite-grade chemical incendiary).
This was NOT an electrical arc flash. An incendiary charge was placed directly inside Breaker 4B to simulate an electrical fire and trigger the fire suppression dampers to lock shut.`,
    uvHiddenText: 'UV FLUORESCENCE: Military serial number on fuse casing: "ORD-NAV-991-INCENDIARY".',
    contradictsClaimId: 'CLAIM_FIRE_CAUSE',
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Forensic', 'Arson', 'Thermite']
  },
  {
    id: 'CLUE_MAINTENANCE_LOG',
    title: "Contractor's Blueprint Notation",
    category: 'DOCUMENT',
    roomId: 'ROOM_DRAINAGE',
    roomName: 'Flooded Drainage Culvert',
    dateStamp: 'Oct 30, 2009',
    summary: 'A rolled structural schematic left on the maintenance workbench by contractor Lucas Boyd.',
    content: `HANDWRITTEN NOTE OVER SUB-LEVEL 3 BLUEPRINT:
"Behind the drainage sump in the generator room, there's a bypass service hatch that leads to the old drainage culvert running under Route 9.
If Finch locks the main blast doors, this is the only way out without an authorized retinal scan."`,
    uvHiddenText: 'UV FLUORESCENCE: Arrow drawn to hatch with notation: "Escaped through here at 00:22."',
    contradictsClaimId: null,
    supportsDeduction: 'DED_SABOTAGE_TIMELINE',
    tags: ['Escape Route', 'Schematic']
  },
  {
    id: 'CLUE_AUDIO_TAPE_THORNE',
    title: 'Chief Engineer Thorne Dictaphone Memo',
    category: 'AUDIO',
    roomId: 'ROOM_DRAINAGE',
    roomName: 'Flooded Drainage Culvert',
    dateStamp: 'Nov 14, 2009 - 23:50',
    summary: 'Handheld mini-cassette discovered wedged behind the transformer cooling coil.',
    audioDuration: '00:36',
    transcript: `[CLICK... HEAVY MACHINERY DRONE]
THORNE: "This is Samuel Thorne, 23:50. Vance came down here demanding I disconnect the emergency siren and lock the ventilation dampers. I refused. He drew his sidearm and said it was Director Finch's direct executive order. 
I saw him carry two military incendiary canisters toward the lab corridor. If you're hearing this, the fire that's about to happen is premeditated arson. May God have mercy on whoever's still in the cryo suites."
[RAPID METALLIC FOOTSTEPS... SHOUTING... END OF LOG]`,
    uvHiddenText: 'UV FLUORESCENCE: "Vance is using Finch\'s personal security override code: JANUS-13-AWAKE".',
    contradictsClaimId: 'CLAIM_FIRE_CAUSE',
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Audio Tape', 'Samuel Thorne', 'Arson']
  },
  {
    id: 'CLUE_13TH_FILE',
    title: 'The 13th Personnel Folder: "Dr. Paul Vance"',
    category: 'DOCUMENT',
    roomId: 'ROOM_ARCHIVE',
    roomName: "Director's Vault & Cold Archives",
    dateStamp: 'Nov 14, 2009 - 23:30 (Backdated to 2008)',
    summary: 'The centerpiece file received in the anonymous package. Stamped "CONFIDENTIAL PERSONNEL DOSSIER - DEPUTY DIRECTOR PAUL VANCE".',
    content: `DOSSIER #BK-13:
NAME: Paul Vance, Ph.D.
TITLE: Deputy Director of Cognitive Implants
DATE OF HIRE: March 12, 2008 (Backdated)
EMERGENCY CONTACT: Marcus Vance (Brother)

DISCOVERY: The paper stock of this document is 2009 laser-print bond, completely inconsistent with genuine 2008 archival forms.
The ID photograph is a composite digital render created from blended facial features.`,
    uvHiddenText: 'UV FLUORESCENCE: WATERMARK REVEALS: "FORGERY ORDERED BY A. FINCH / COMPILED BY R. FOSTER NOV 14, 2009 23:30".',
    contradictsClaimId: 'CLAIM_PAUL_VANCE_EMPLOYEE',
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['The 13th File', 'Key Evidence', 'Forgery']
  },
  {
    id: 'CLUE_PAYROLL_AUDIT',
    title: 'External Auditor Kray 2008-2009 Payroll Ledger',
    category: 'DOCUMENT',
    roomId: 'ROOM_ARCHIVE',
    roomName: "Director's Vault & Cold Archives",
    dateStamp: 'Nov 12, 2009',
    summary: 'Hardbound financial audit register with forensic red-ink checkmarks on every employee stipend.',
    content: `GOVERNMENT GRANT DISBURSEMENT AUDIT:
Total official staff on Sub-Level 3 payroll: Exactly 12 individuals.
Dr. Alistair Finch ($185k)
Dr. Elena Cruz ($145k)
Marcus Vance ($110k)
...
Total 12 checks cut monthly.
AUDITOR NOTE: "No payment, tax ID, or medical insurance record has ever existed for any 'Paul Vance'. His name was inserted into the emergency roster only 48 hours ago."`,
    uvHiddenText: 'UV FLUORESCENCE: Red stamp: "CRIMINAL FRAUD REFERRAL PENDING - NOV 16, 2009".',
    contradictsClaimId: 'CLAIM_PAUL_VANCE_EMPLOYEE',
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['Financial', 'Payroll', 'Proof']
  },
  {
    id: 'CLUE_JANUS_DIRECTIVE',
    title: "Director Finch's Executive Directive #09",
    category: 'DOCUMENT',
    roomId: 'ROOM_ARCHIVE',
    roomName: "Director's Vault & Cold Archives",
    dateStamp: 'Nov 10, 2009',
    summary: 'Sealed manila folder containing the signed protocol for Project Janus termination and clean-up.',
    content: `DIRECTIVE: 'FINAL DISPOSITION - ZERO AUDIT PROTOCOL'
AUTHOR: Dr. Alistair Finch
CO-SIGNER: Marcus Vance

"In the event of an imminent federal inspection or whistleblowing leak by Dr. Cruz:
1. Initiate lockdown protocol OMEGA.
2. Neutralize local surveillance and wipe central storage.
3. Overwrite Subject Zero's core identity with an investigative archetype to induce retroactive confabulation.
4. Deploy localized incendiaries at Substation B to seal the lower chambers.
5. In official filings, register 13 casualties by creating a deceased persona under Marcus Vance's family alias."`,
    uvHiddenText: 'UV FLUORESCENCE: MASTER OVERRIDE CYPHER: "JANUS-13-AWAKE".',
    contradictsClaimId: 'CLAIM_FINCH_ACCIDENT',
    supportsDeduction: 'DED_COVERUP_FIRE',
    tags: ['Smoking Gun', 'Directive', 'Finch']
  },
  {
    id: 'CLUE_AUDIO_TAPE_FINCH',
    title: "Director Finch's Final Tape Memo",
    category: 'AUDIO',
    roomId: 'ROOM_ARCHIVE',
    roomName: "Director's Vault & Cold Archives",
    dateStamp: 'Nov 15, 2009 - 01:20',
    summary: 'Master dictation reel found loaded inside the vault desk recorder.',
    audioDuration: '00:52',
    transcript: `[LOW TAPE HUM... GLASS OF WHISKEY CLINKING]
FINCH: "It's done. The fire is burning in Substation B. The smoke dampers have suffocated Sub-Level 3. Marcus executed his part with military precision.
Elena will never present her whistleblowing docket to the Department of Energy.
As for Subject Zero... the pod was empty when Marcus reached the chamber. Someone pulled the emergency release valve. If he is out there, wandering the snowy woods with a shattered mind... he will believe he is whoever we made him believe. 
Seventeen years from now, if he ever remembers... the 13th file will be waiting."`,
    uvHiddenText: 'UV FLUORESCENCE: "HE WILL COME BACK AS AN INVESTIGATOR."',
    contradictsClaimId: 'CLAIM_FINCH_ACCIDENT',
    supportsDeduction: 'DED_SUBJECT_13_IDENTITY',
    tags: ['Audio Tape', 'Finch Confession', 'Climax']
  }
];

// Priority 2: Explicit Relationship Graph defining every valid link type and fact established
export const CLUE_RELATIONSHIPS = [
  {
    id: 'REL_CAMERA_TELEMETRY',
    clueA: 'CLUE_CAMERA_LOG',
    clueB: 'CLUE_GENERATOR_TELEMETRY',
    type: 'CONTRADICTION',
    factEstablished: 'Camera Node 04 was cut at 23:42 despite continuous uninterrupted 480V power, proving deliberate surveillance tampering.'
  },
  {
    id: 'REL_CAMERA_BADGE',
    clueA: 'CLUE_CAMERA_LOG',
    clueB: 'CLUE_SECURITY_BADGE',
    type: 'CORROBORATION',
    factEstablished: "Surveillance terminal command was executed using CSO Vance's credentials at 23:42, corroborating the short-circuited master pass."
  },
  {
    id: 'REL_FENCE_CRYO',
    clueA: 'CLUE_PERIMETER_FENCE',
    clueB: 'CLUE_CRYO_LOG',
    type: 'LEAD',
    factEstablished: 'Outward-severed fence breach at 00:28 corroborates the emergency release valve tripped on Pod 13 at 00:14.'
  },
  {
    id: 'REL_AUTOPSY_FUSE',
    clueA: 'CLUE_AUTOPSY_REPORT',
    clueB: 'CLUE_BURNT_FUSE',
    type: 'CONTRADICTION',
    factEstablished: 'Tissue damage showed -180°C cryogenic freezing rather than thermal burns, proving Breaker 4B thermite fire was an incendiary distraction.'
  },
  {
    id: 'REL_AUTOPSY_CRUZ',
    clueA: 'CLUE_AUTOPSY_REPORT',
    clueB: 'CLUE_AUDIO_TAPE_CRUZ',
    type: 'CORROBORATION',
    factEstablished: "Coroner dissent tissue freezing corroborates Dr. Cruz's recorded warning that Finch ordered the cryo-chamber purge."
  },
  {
    id: 'REL_FILE13_PAYROLL',
    clueA: 'CLUE_13TH_FILE',
    clueB: 'CLUE_PAYROLL_AUDIT',
    type: 'CONTRADICTION',
    factEstablished: "Dr. Paul Vance 2008 appointment directly contradicts Auditor Kray's ledger showing zero payroll, tax, or medical records."
  },
  {
    id: 'REL_FILE13_CRYO',
    clueA: 'CLUE_13TH_FILE',
    clueB: 'CLUE_CRYO_LOG',
    type: 'CORROBORATION',
    factEstablished: 'The 13th file was fabricated to conceal the existence of Test Subject Zero inside Cryo-Pod 13.'
  },
  {
    id: 'REL_CRYO_NEURAL',
    clueA: 'CLUE_CRYO_LOG',
    clueB: 'CLUE_NEURAL_READOUT',
    type: 'CORROBORATION',
    factEstablished: "Pod 13's 40Hz Gamma sync telemetry corroborates synthetic memory implant trial #44 grafting the Julian Ward persona."
  },
  {
    id: 'REL_THORNE_DIRECTIVE',
    clueA: 'CLUE_AUDIO_TAPE_THORNE',
    clueB: 'CLUE_JANUS_DIRECTIVE',
    type: 'CORROBORATION',
    factEstablished: "Chief Engineer Thorne's recording corroborates Finch's signed Protocol OMEGA directive ordering Vance to deploy thermite charges."
  },
  {
    id: 'REL_GRAFFITI_MAINTENANCE',
    clueA: 'CLUE_TUNNEL_GRAFFITI',
    clueB: 'CLUE_MAINTENANCE_LOG',
    type: 'LEAD',
    factEstablished: "Graffiti 'THEY ARE NOT GOING TO LET US OUT - 13' corroborates contractor Boyd's blueprint notation regarding the drainage culvert escape hatch."
  }
];

export const SUSPECTS = [
  {
    id: 'SUSP_VANCE',
    name: 'Marcus Vance',
    role: 'Chief Security Officer',
    avatar: '🛡️',
    status: 'Suspect & Accomplice',
    motive: 'Covered up illegal facility operations under lucrative private contract and eliminated evidence.',
    bio: 'Former military contractor known for ruthless perimeter control. Controlled all Sub-Level 3 security keys, blast-door solenoids, and video feeds.',
    claims: [
      {
        id: 'CLAIM_VANCE_MIDNIGHT',
        statement: '"The electrical grid blew out at midnight (00:00) sharp. All surveillance screens went black instantly, and I barely escaped through the main elevator before the doors welded shut from the heat."',
        status: 'UNCONTESTED',
        counterClueId: 'CLUE_CAMERA_LOG',
        rebuttalText: 'Vance breaks into a cold sweat: "Alright, dammit! I cut Node 04 at 23:42 because Finch ordered me to clear the corridor for the transport team! But the fire—the fire wasn\'t an accident!"',
        unlockedEvidence: 'CLUE_BURNT_FUSE'
      }
    ]
  },
  {
    id: 'SUSP_FINCH',
    name: 'Dr. Alistair Finch',
    role: 'Facility Director (Project Janus)',
    avatar: '🔬',
    status: 'Prime Architect of Cover-up',
    motive: 'Protecting his life work and preventing a 25-year prison sentence for illegal human neural rewrites.',
    bio: 'Renowned neuro-cyberneticist. When government funding was revoked, he converted Blackwood into an unsanctioned underground human testing facility.',
    claims: [
      {
        id: 'CLAIM_FINCH_ACCIDENT',
        statement: '"The disaster was a tragic industrial catastrophe. A high-voltage surge in Substation B ignited the cryogenic coolant lines. I lost twelve brilliant colleagues, plus my dear friend Paul Vance."',
        status: 'UNCONTESTED',
        counterClueId: 'CLUE_JANUS_DIRECTIVE',
        rebuttalText: 'Finch\'s cold facade collapses: "You found the directive... Then you know. You know you were never supposed to walk into this facility with a badge, Julian. You were supposed to stay asleep."',
        unlockedEvidence: 'CLUE_AUDIO_TAPE_FINCH'
      }
    ]
  },
  {
    id: 'SUSP_PAUL_VANCE',
    name: 'Dr. Paul Vance (The 13th Phantom)',
    role: 'Alleged Deputy Director',
    avatar: '👤',
    status: 'Fabricated Entity',
    motive: 'Does not exist. Created to hide the true 13th person.',
    bio: 'Listed on the official casualty manifest as Marcus Vance\'s brother. No academic papers, tax forms, or real photographs exist.',
    claims: [
      {
        id: 'CLAIM_PAUL_VANCE_EMPLOYEE',
        statement: 'Official Government Inquest: "Dr. Paul Vance was a full-time senior researcher who perished alongside the staff inside Cryo-Lab 03."',
        status: 'UNCONTESTED',
        counterClueId: 'CLUE_PAYROLL_AUDIT',
        rebuttalText: 'Auditor records and forged documents prove beyond a shadow of doubt: Dr. Paul Vance never existed. The 13th occupant was Subject Zero.',
        unlockedEvidence: 'CLUE_CRYO_LOG'
      }
    ]
  },
  {
    id: 'SUSP_OFFICIAL_REPORT',
    name: 'The Official 2009 Fire Inquest',
    role: 'Government & Corporate Narrative',
    avatar: '📜',
    status: 'Falsified Inquest',
    motive: 'Conceal classified bio-weapon and cognitive warfare funding.',
    bio: 'Compiled by private investigators and rubber-stamped by corrupt officials to close the case in 30 days.',
    claims: [
      {
        id: 'CLAIM_FIRE_CAUSE',
        statement: '"The victims died of catastrophic flash burns resulting from a spontaneous transformer explosion."',
        status: 'UNCONTESTED',
        counterClueId: 'CLUE_AUTOPSY_REPORT',
        rebuttalText: 'The autopsy confirms cryogenic freezing and thermite arson, completely debunking the spontaneous electrical fire narrative.',
        unlockedEvidence: 'CLUE_AUDIO_TAPE_THORNE'
      }
    ]
  }
];

// Priority 2: Explicit Dependency Graph for Every Deduction
export const DEDUCTIONS = [
  {
    id: 'DED_SABOTAGE_TIMELINE',
    title: 'Deduction 1: The Missing Hour & Premeditated Sabotage',
    inquiry: 'What actually triggered the blackout and disaster on November 14, 2009?',
    options: [
      { id: 'OPT_ARC_FLASH', label: 'Spontaneous high-voltage electrical failure in Substation B.', isCorrect: false },
      { id: 'OPT_PREMEDITATED', label: 'Marcus Vance manually killed cameras at 23:42 and ignited thermite to simulate a fire.', isCorrect: true },
      { id: 'OPT_CRYO_LEAK', label: 'An accidental liquid nitrogen leak suffocated the personnel.', isCorrect: false }
    ],
    requiredClues: ['CLUE_CAMERA_LOG', 'CLUE_GENERATOR_TELEMETRY', 'CLUE_BURNT_FUSE'],
    requiredClaims: ['CLAIM_VANCE_MIDNIGHT'],
    requiredLinks: [['CLUE_CAMERA_LOG', 'CLUE_GENERATOR_TELEMETRY']],
    explanation: 'Surveillance Node 04 was manually killed at 23:42, telemetry proved continuous backup power, and thermite incendiary residue was found inside breaker 4B.',
    resolved: false
  },
  {
    id: 'DED_COVERUP_FIRE',
    title: 'Deduction 2: The Fire Was a Mask for Murder',
    inquiry: 'Why was the fire started inside Substation B and Lab 03?',
    options: [
      { id: 'OPT_ACCIDENT', label: 'It was collateral damage from an overloaded mainframe server.', isCorrect: false },
      { id: 'OPT_MASK_MURDER', label: 'To eliminate whistleblower Dr. Cruz and auditor Kray, masking cryogenic execution with arson.', isCorrect: true },
      { id: 'OPT_INSURANCE', label: 'A simple insurance fraud scheme gone wrong.', isCorrect: false }
    ],
    requiredClues: ['CLUE_AUTOPSY_REPORT', 'CLUE_AUDIO_TAPE_CRUZ', 'CLUE_AUDIO_TAPE_THORNE'],
    requiredClaims: ['CLAIM_FIRE_CAUSE'],
    requiredLinks: [['CLUE_AUTOPSY_REPORT', 'CLUE_BURNT_FUSE']],
    explanation: 'Autopsy confirmed liquid nitrogen freeze-fracture rather than smoke inhalation, and Cruz\'s tape proved Finch initiated lockdown to eliminate whistleblowers.',
    resolved: false
  },
  {
    id: 'DED_SUBJECT_13_IDENTITY',
    title: 'Deduction 3: The Secret of the 13th File & The Investigator',
    inquiry: 'Who was the 13th person, and why was Dr. Paul Vance invented?',
    options: [
      { id: 'OPT_FINCH_SON', label: 'Paul Vance was Finch\'s secret business partner who stole $40M.', isCorrect: false },
      { id: 'OPT_SUBJECT_ZERO', label: 'Paul Vance was a fake name created to mask Test Subject Zero (the player), whose mind was overwritten with an investigator persona.', isCorrect: true },
      { id: 'OPT_RUSSIAN_SPY', label: 'Paul Vance was a foreign agent who escaped through the drainage culvert.', isCorrect: false }
    ],
    requiredClues: ['CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT', 'CLUE_CRYO_LOG', 'CLUE_NEURAL_READOUT'],
    requiredClaims: ['CLAIM_PAUL_VANCE_EMPLOYEE'],
    requiredLinks: [['CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT'], ['CLUE_CRYO_LOG', 'CLUE_NEURAL_READOUT']],
    explanation: 'Auditor payroll proved Paul Vance never existed. The 13th file was forged to mask Subject Zero. The neural readout proves the investigator Julian Ward is Subject Zero.',
    resolved: false
  }
];

// Priority 1 & 2: Strict Ending Prerequisites
export const ENDING_RULES = {
  OFFICIAL_PATSY: {
    id: 'OFFICIAL_PATSY',
    title: 'Ending A: The Official Patsy',
    subtitle: 'The False Closure',
    badge: 'BAD ENDING',
    color: '#e74c3c',
    requiredDeductions: ['DED_SABOTAGE_TIMELINE'],
    requiredClaims: ['CLAIM_VANCE_MIDNIGHT'],
    requiredClues: ['CLUE_CAMERA_LOG', 'CLUE_BURNT_FUSE'],
    description: `You submit Marcus Vance as the sole perpetrator of arson and murder. 
Vance is condemned posthumously in the media. However, because the 13th file remained uncracked, Dr. Alistair Finch's illegal neural experiments remain sealed. 
Project Janus continues under another corporate shell, and your own identity remains an artificial illusion.`
  },
  CORPORATE_EXPOSE: {
    id: 'CORPORATE_EXPOSE',
    title: 'Ending B: The Whistleblower’s Shadow',
    subtitle: 'Partial Justice',
    badge: 'GOOD ENDING',
    color: '#3498db',
    requiredDeductions: ['DED_SABOTAGE_TIMELINE', 'DED_COVERUP_FIRE'],
    requiredClaims: ['CLAIM_VANCE_MIDNIGHT', 'CLAIM_FIRE_CAUSE'],
    requiredClues: ['CLUE_CAMERA_LOG', 'CLUE_AUTOPSY_REPORT', 'CLUE_AUDIO_TAPE_CRUZ'],
    description: `You release Dr. Elena Cruz's hidden tapes and the financial audit records to federal prosecutors. 
Director Finch's foundation is raided, and the cover-up of the 2009 fire is broken across national headlines. 
Yet, the secret of who survived inside Pod 13 remains unsolved in official annals.`
  },
  THE_13TH_FILE_UNLOCKED: {
    id: 'THE_13TH_FILE_UNLOCKED',
    title: 'Ending C: The 13th File Unlocked (TRUE ENDING)',
    subtitle: 'The Mirror of Memory',
    badge: 'TRUE ENDING ★',
    color: '#2ecc71',
    requiredDeductions: ['DED_SABOTAGE_TIMELINE', 'DED_COVERUP_FIRE', 'DED_SUBJECT_13_IDENTITY'],
    requiredClaims: ['CLAIM_VANCE_MIDNIGHT', 'CLAIM_FIRE_CAUSE', 'CLAIM_PAUL_VANCE_EMPLOYEE'],
    requiredClues: ['CLUE_13TH_FILE', 'CLUE_PAYROLL_AUDIT', 'CLUE_CRYO_LOG', 'CLUE_NEURAL_READOUT'],
    description: `You piece together the forged dossier, the Cryo-Pod 13 telemetry, and the neural overwrite records.
The realization strikes like an electrical shock: You are not an outside detective who stumbled upon this case. You are Subject Zero. 
Seventeen years ago, someone pulled your emergency release valve. The "Julian Ward" persona was an implanted memory graft designed by Dr. Finch. 
By confronting the truth, the synthetic amnesia shatters. You retrieve the uncorrupted master neural backup and walk out into the dawn—free for the first time.`
  },
  JANUS_GLOBAL_AWAKENING: {
    id: 'JANUS_GLOBAL_AWAKENING',
    title: 'Secret Ending D: The Janus Awakening',
    subtitle: 'The Master Cypher: JANUS-13-AWAKE',
    badge: 'SECRET ENDING ★★★',
    color: '#9b59b6',
    requiredCipher: 'JANUS-13-AWAKE',
    requiredDeductions: ['DED_SABOTAGE_TIMELINE', 'DED_COVERUP_FIRE', 'DED_SUBJECT_13_IDENTITY'],
    requiredClaims: ['CLAIM_FINCH_ACCIDENT', 'CLAIM_PAUL_VANCE_EMPLOYEE'],
    requiredClues: ['CLUE_JANUS_DIRECTIVE', 'CLUE_AUDIO_TAPE_THORNE'],
    description: `Using the forensic UV cipher "JANUS-13-AWAKE" on Director Finch's master vault terminal, you bypass the final biometric lockout. 
Instead of merely uncovering your own past, you broadcast the unredacted memory data of all 12 victims to every major university and newsroom on the planet. 
The names of Cruz, Thorne, Lin, and the victims are forever vindicated. The truth can never be locked away again.`
  }
};

export const ENDINGS = ENDING_RULES;

export const CHAPTERS = [
  {
    num: 1,
    title: 'The Arrival',
    focus: 'Entering Sub-Level 3 & Discovering the Incomplete Roster',
    status: 'COMPLETED',
    summary: 'You reached the sealed Blackwood Research Facility and retrieved the 12-person manifest. The 13th file was missing from the archive.'
  },
  {
    num: 2,
    title: 'The Missing Hour',
    focus: 'Reconstructing the 23:42 - 00:00 Gap',
    status: 'ACTIVE',
    summary: 'Compare surveillance node logs against Marcus Vance’s claim of an instantaneous midnight blackout.'
  },
  {
    num: 3,
    title: 'The Twelve',
    focus: 'Suspect Motives & The Cryogenic Chamber Discovery',
    status: 'LOCKED',
    summary: 'Uncover Dr. Elena Cruz’s whistleblowing tapes and the truth behind the autopsy freeze fractures.'
  },
  {
    num: 4,
    title: 'The Thirteenth File',
    focus: 'The Fabricated Identity of Paul Vance',
    status: 'LOCKED',
    summary: 'Prove that the 13th employee was an engineered forgery designed to cover up Pod 13.'
  },
  {
    num: 5,
    title: 'The Truth',
    focus: 'The Mirror of Memory & Final Deduction',
    status: 'LOCKED',
    summary: 'Confront your own synthetic past and decide the fate of Project Janus.'
  }
];

// Priority 4: Progressive In-Game Hint System
export const HINTS = [
  {
    chapter: 2,
    level1: 'Search Observation Point 4 and Flooded Drainage for electrical and surveillance telemetry logs.',
    level2: 'Connect Surveillance Node #04 to Substation B Telemetry on the Mystery Board to verify the 23:42 timestamp.',
    level3: 'Confront Chief Security Officer Marcus Vance with the Node #04 Cutoff Log to shatter his 00:00 blackout alibi.'
  },
  {
    chapter: 3,
    level1: 'Examine Cryo-Genomics Lab 03 for autopsy reports and ventilation recordings.',
    level2: 'Link the Coroner Autopsy Report to the Thermite Breaker 4B on the Mystery Board to expose the false fire narrative.',
    level3: 'Listen to Dr. Cruz’s SOS tape in Lab 03 to discover why Director Finch ordered the emergency quarantine.'
  },
  {
    chapter: 4,
    level1: 'Unlock Director Finch’s Vault to inspect the 2008-2009 financial payroll register.',
    level2: 'Connect The 13th Personnel File to Auditor Kray’s Payroll Ledger to prove Dr. Paul Vance was a fabricated identity.',
    level3: 'Confront the Official Report with Auditor Kray’s ledger to unlock Pod 13’s true telemetry.'
  },
  {
    chapter: 5,
    level1: 'Examine the Janus EEG Neural Readout under UV Blacklight in the forensic lab.',
    level2: 'Connect Cryo-Pod 13 to the Janus EEG Neural Mapping chart to verify the identity of Subject Zero.',
    level3: 'Switch to the Final Case Study Journal in the Deduction Matrix and execute the indictment of your true identity.'
  }
];
