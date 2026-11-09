import React, { useState } from 'react';
import { TitleScreen3D } from './components/game3d/TitleScreen3D';
import { GameCanvas3D } from './components/game3d/GameCanvas3D';
import { WorldSelectModal } from './components/game3d/WorldSelectModal';
import { HistoricalWorldId } from './types';
import { sound } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState<'TITLE' | 'GAMEPLAY'>('TITLE');
  const [isWorldSelectOpen, setIsWorldSelectOpen] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<HistoricalWorldId>('WORLD_01_RENGASDENGKLOK');
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleStartGame = (worldId: HistoricalWorldId = 'WORLD_01_RENGASDENGKLOK') => {
    setSelectedWorldId(worldId);
    setScreen('GAMEPLAY');
  };

  return (
    <div className="relative min-h-screen bg-[#0d0b09] text-parchment-100 font-sans selection:bg-amber-600 selection:text-white overflow-hidden">
      {screen === 'TITLE' && (
        <TitleScreen3D
          onStartGame={() => handleStartGame('WORLD_01_RENGASDENGKLOK')}
          onOpenWorldSelect={() => setIsWorldSelectOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {screen === 'GAMEPLAY' && (
        <GameCanvas3D
          onReturnToTitle={() => setScreen('TITLE')}
          initialWorldId={selectedWorldId}
        />
      )}

      {isWorldSelectOpen && (
        <WorldSelectModal
          currentWorldId={selectedWorldId}
          onSelectWorld={(worldId) => {
            setIsWorldSelectOpen(false);
            handleStartGame(worldId);
          }}
          onClose={() => setIsWorldSelectOpen(false)}
        />
      )}
    </div>
  );
}
