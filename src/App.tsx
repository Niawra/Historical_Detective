import React from 'react';
import { useGame, GameProvider } from './context/GameContext';
import { TitleScreen } from './components/TitleScreen';
import { CaseSelectModal } from './components/CaseSelectModal';
import { CaseBriefing } from './components/CaseBriefing';
import { InvestigationDesk } from './components/InvestigationDesk';
import { EvidenceBoard } from './components/EvidenceBoard';
import { CaseReportModal } from './components/CaseReportModal';

// Modals
import { EvidenceArchiveModal } from './components/EvidenceArchiveModal';
import { TimelinePuzzleModal } from './components/TimelinePuzzleModal';
import { RoleMatchingPuzzleModal } from './components/RoleMatchingPuzzleModal';
import { CipherPuzzleModal } from './components/CipherPuzzleModal';
import { DetectiveNotesModal } from './components/DetectiveNotesModal';
import { FinalDeductionModal } from './components/FinalDeductionModal';
import { SettingsModal } from './components/SettingsModal';
import { EvidenceDiscoveredToast } from './components/EvidenceDiscoveredToast';

const GameRouter: React.FC = () => {
  const { activeView, activeModal } = useGame();

  const renderActiveView = () => {
    switch (activeView) {
      case 'TITLE':
        return <TitleScreen />;
      case 'CASE_SELECT':
        return <CaseSelectModal />;
      case 'BRIEFING':
        return <CaseBriefing />;
      case 'INVESTIGATION':
        return <InvestigationDesk />;
      case 'EVIDENCE_BOARD':
        return <EvidenceBoard />;
      case 'CASE_REPORT':
        return <CaseReportModal />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="relative min-h-screen bg-detective-950 font-sans selection:bg-seal-red selection:text-white">
      {/* Primary View */}
      {renderActiveView()}

      {/* Floating Modal Overlays */}
      {(activeModal === 'ARCHIVE' || activeModal === 'EVIDENCE_DETAIL') && <EvidenceArchiveModal />}
      {activeModal === 'TIMELINE' && <TimelinePuzzleModal />}
      {activeModal === 'MATCHING' && <RoleMatchingPuzzleModal />}
      {activeModal === 'CIPHER' && <CipherPuzzleModal />}
      {activeModal === 'NOTES' && <DetectiveNotesModal />}
      {activeModal === 'DEDUCTION' && <FinalDeductionModal />}
      {activeModal === 'SETTINGS' && <SettingsModal />}

      {/* Toast Notification for Discovered Evidence */}
      <EvidenceDiscoveredToast />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
