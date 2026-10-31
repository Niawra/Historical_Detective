import React from 'react';
import { AdventureProvider, useAdventure } from './context/AdventureContext';
import { MainMenu } from './components/adventure/MainMenu';
import { MissionSelect } from './components/adventure/MissionSelect';
import { AdventureGameplay } from './components/adventure/AdventureGameplay';
import { InvestigationReport } from './components/adventure/InvestigationReport';

const GameRouter: React.FC = () => {
  const { screen } = useAdventure();

  switch (screen) {
    case 'MENU_UTAMA':
      return <MainMenu />;
    case 'PILIH_MISI':
      return <MissionSelect />;
    case 'GAMEPLAY':
      return <AdventureGameplay />;
    case 'HASIL_INVESTIGASI':
      return <InvestigationReport />;
    default:
      return <MainMenu />;
  }
};

export default function App() {
  return (
    <AdventureProvider>
      <div className="relative min-h-screen bg-[#0d0b09] text-parchment-100 font-sans selection:bg-seal-red selection:text-white">
        <GameRouter />
      </div>
    </AdventureProvider>
  );
}
