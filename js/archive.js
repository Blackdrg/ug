// The Unlocked Archive & Five-Chapter Progression Hub
import { CHAPTERS } from './data.js';
import { state } from './state.js';
import { sound } from './audio.js';

export class ArchiveViewer {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
    this.setupListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="archive-layout">
        <!-- Archive Header -->
        <div class="archive-header">
          <div class="archive-brand">
            <span class="archive-badge">📁 THE UNLOCKED ARCHIVE</span>
            <h2 class="archive-title">BLACKWOOD INCIDENT: CHAPTER PROGRESSION</h2>
            <p class="archive-desc">
              Every solved deduction unlocks another tier of the declassified files. The story accounting accounts for all 12 personnel and the phantom 13th file.
            </p>
          </div>
          <div class="archive-current-chapter">
            CURRENT ACCESS: <strong>CHAPTER 0${state.currentChapter}</strong>
          </div>
        </div>

        <!-- Five Chapters Timeline -->
        <div class="chapters-timeline">
          ${CHAPTERS.map(ch => {
            const isUnlocked = ch.num <= state.currentChapter;
            const isActive = ch.num === state.currentChapter;
            const isCompleted = ch.num < state.currentChapter;

            return `
              <div class="chapter-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active-chapter' : ''}">
                <div class="chapter-meta">
                  <span class="chapter-num">CHAPTER 0${ch.num}</span>
                  <span class="chapter-pill ${isCompleted ? 'pill-completed' : isActive ? 'pill-active' : 'pill-locked'}">
                    ${isCompleted ? '✓ COMPLETED' : isActive ? '● CURRENT OBJECTIVE' : '🔒 CLASSIFIED'}
                  </span>
                </div>

                <h3 class="chapter-title">${ch.title}</h3>
                <div class="chapter-focus"><strong>Focus:</strong> ${ch.focus}</div>
                <p class="chapter-summary">${isUnlocked ? ch.summary : 'Encrypted with Level 5 Security Key. Unlocked by resolving corresponding forensic deductions.'}</p>
              </div>
            `;
          }).join('')}
        </div>

        <!-- The Twelve Personnel Roster -->
        <div class="twelve-manifest-section">
          <h3 class="manifest-title">THE TWELVE OFFICIAL DISAPPEARANCES & THE PHANTOM FILE:</h3>
          <div class="manifest-table-wrapper">
            <table class="manifest-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department / Role</th>
                  <th>Official 2009 Status</th>
                  <th>2026 Uncovered Truth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SUSP-01</td>
                  <td><strong>Dr. Alistair Finch</strong></td>
                  <td>Director of Project Janus</td>
                  <td>Deceased (Fire)</td>
                  <td class="text-danger">Architect of Illegal Memory Rewrites & Arson</td>
                </tr>
                <tr>
                  <td>SUSP-02</td>
                  <td><strong>Dr. Elena Cruz</strong></td>
                  <td>Chief Neuroscientist</td>
                  <td>Deceased (Fire)</td>
                  <td class="text-info">Whistleblower; Hid SOS tape before cryo-lockdown</td>
                </tr>
                <tr>
                  <td>SUSP-03</td>
                  <td><strong>Marcus Vance</strong></td>
                  <td>Chief Security Officer</td>
                  <td>Deceased (Fire)</td>
                  <td class="text-warning">Accomplice; Cut surveillance at 23:42 and ignited thermite</td>
                </tr>
                <tr>
                  <td>SUSP-04</td>
                  <td><strong>Samuel Thorne</strong></td>
                  <td>Lead Facilities Engineer</td>
                  <td>Deceased (Fire)</td>
                  <td class="text-success">Recorded continuous generator telemetry exposing the hoax</td>
                </tr>
                <tr>
                  <td>SUSP-05</td>
                  <td><strong>Maya Lin</strong></td>
                  <td>Data Cryptographer</td>
                  <td>Deceased (Fire)</td>
                  <td>Discovered memory dumps wiped before sirens sounded</td>
                </tr>
                <tr>
                  <td>SUSP-06</td>
                  <td><strong>Dr. Julian Croft</strong></td>
                  <td>Bio-Cybernetics Lead</td>
                  <td>Deceased (Fire)</td>
                  <td>Designed neural synchronization helmet</td>
                </tr>
                <tr>
                  <td>SUSP-07</td>
                  <td><strong>Sean O'Connor</strong></td>
                  <td>Lab Assistant</td>
                  <td>Deceased (Fire)</td>
                  <td>Smuggled clandestine polaroids of holding cell</td>
                </tr>
                <tr>
                  <td>SUSP-08</td>
                  <td><strong>Rachel Foster</strong></td>
                  <td>Head Archivist</td>
                  <td>Deceased (Fire)</td>
                  <td>Forced at gunpoint to forge "Dr. Paul Vance" file</td>
                </tr>
                <tr>
                  <td>SUSP-09</td>
                  <td><strong>Victor Kray</strong></td>
                  <td>External Grant Auditor</td>
                  <td>Deceased (Fire)</td>
                  <td>Discovered $42M financial embezzlement trail</td>
                </tr>
                <tr>
                  <td>SUSP-10</td>
                  <td><strong>Nadia Solokov</strong></td>
                  <td>Medical Specialist</td>
                  <td>Deceased (Fire)</td>
                  <td>Logged flatline EEG on unconsenting subject</td>
                </tr>
                <tr>
                  <td>SUSP-11</td>
                  <td><strong>Lucas Boyd</strong></td>
                  <td>Tunnel Contractor</td>
                  <td>Deceased (Fire)</td>
                  <td>Marked hidden drainage culvert escape hatch</td>
                </tr>
                <tr>
                  <td>SUSP-12</td>
                  <td><strong>Clara DeWitt</strong></td>
                  <td>Research Fellow</td>
                  <td>Deceased (Fire)</td>
                  <td>Finch's protégé double-crossed during server wipe</td>
                </tr>
                <tr class="row-phantom">
                  <td>FILE-13</td>
                  <td><strong>"Dr. Paul Vance"</strong></td>
                  <td>"Deputy Director"</td>
                  <td>Deceased (Fire)</td>
                  <td class="text-special">★ FORGERY: Masked Test Subject Zero (The Investigator)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  setupListeners() {
    // Read-only reference table
  }
}
