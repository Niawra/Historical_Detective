import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine3D, NearbyTarget } from '../../game3d/Engine3D';
import { HUDOverlay } from './HUDOverlay';
import { DialogueOverlay } from './DialogueOverlay';
import { MiniGameModal } from './MiniGameModal';
import { JournalModal } from './JournalModal';
import { WorldSelectModal } from './WorldSelectModal';
import { PauseSettingsModal } from './PauseSettingsModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { TouchControls } from './TouchControls';
import { 
  HistoricalWorldId, 
  Quest, 
  CollectibleItem, 
  DetectiveBadge, 
  NPCEntity, 
  MiniGameData 
} from '../../types';
import { 
  WORLD_01_QUESTS, 
  WORLD_01_COLLECTIBLES, 
  WORLD_01_NPCS, 
  GAME_BADGES 
} from '../../data/worldData';
import { sound } from '../../utils/audio';

interface GameCanvas3DProps {
  onReturnToTitle: () => void;
  initialWorldId?: HistoricalWorldId;
}

export const GameCanvas3D: React.FC<GameCanvas3DProps> = ({ 
  onReturnToTitle,
  initialWorldId = 'WORLD_01_RENGASDENGKLOK'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine3D | null>(null);

  // Game States
  const [currentWorldId, setCurrentWorldId] = useState<HistoricalWorldId>(initialWorldId);
  const [quests, setQuests] = useState<Quest[]>(WORLD_01_QUESTS);
  const [activeQuestIndex, setActiveQuestIndex] = useState<number>(0);
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(WORLD_01_COLLECTIBLES);
  const [badges, setBadges] = useState<DetectiveBadge[]>(GAME_BADGES);
  const [xp, setXp] = useState<number>(50);
  const [level, setLevel] = useState<number>(1);
  const [stars, setStars] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Overlays state
  const [nearbyTarget, setNearbyTarget] = useState<NearbyTarget | null>(null);
  const [activeDialogueNPC, setActiveDialogueNPC] = useState<NPCEntity | null>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameData | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isWorldSelectOpen, setIsWorldSelectOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLevelCompleteOpen, setIsLevelCompleteOpen] = useState<boolean>(false);

  // Active quest
  const activeQuest = quests[activeQuestIndex] || quests[0];

  // Helper to award XP and check Level Up
  const addXP = useCallback((amount: number) => {
    setXp(prev => {
      const next = prev + amount;
      const newLevel = Math.floor(next / 200) + 1;
      setLevel(newLevel);
      return next;
    });
  }, []);

  // Helper to unlock badges
  const unlockBadge = useCallback((badgeId: string) => {
    setBadges(prev => {
      const found = prev.find(b => b.id === badgeId);
      if (found && !found.isUnlocked) {
        sound.playCompassChime();
        addXP(100);
        return prev.map(b => b.id === badgeId ? { ...b, isUnlocked: true } : b);
      }
      return prev;
    });
  }, [addXP]);

  // Advance Quest Steps
  const advanceActiveQuest = useCallback(() => {
    setQuests(prev => {
      const copy = [...prev];
      const q = copy[activeQuestIndex];
      if (!q) return prev;

      if (q.currentStepIndex < q.steps.length - 1) {
        q.steps[q.currentStepIndex].isCompleted = true;
        q.currentStepIndex += 1;
        sound.playCompassChime();
      } else {
        q.steps[q.currentStepIndex].isCompleted = true;
        q.isCompleted = true;
        sound.playQuestComplete();
        addXP(q.rewardXP);

        // Advance to next quest if available
        if (activeQuestIndex < copy.length - 1) {
          setActiveQuestIndex(prevIdx => prevIdx + 1);
        } else {
          // All quests finished! Trigger Level Complete Grand Finale
          unlockBadge('badge-master-adventurer');
          unlockBadge('badge-nusantara-explorer');
          setTimeout(() => setIsLevelCompleteOpen(true), 1200);
        }
      }
      return copy;
    });
  }, [activeQuestIndex, addXP, unlockBadge]);

  // Active quest target synchronization with Engine3D
  useEffect(() => {
    if (!engineRef.current) return;
    let targetId: string | null = null;
    if (activeQuest.id === 'quest-01-singgih') {
      targetId = 'npc-singgih';
    } else if (activeQuest.id === 'quest-02-dispatch') {
      const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
      targetId = hasPouch ? 'npc-djiaw' : 'col-dispatch-pouch';
    } else if (activeQuest.id === 'quest-03-cipher') {
      targetId = 'chest-peta';
    } else if (activeQuest.id === 'quest-04-veranda') {
      targetId = 'npc-soekarno';
    } else if (activeQuest.id === 'quest-05-timeline') {
      targetId = 'npc-soebardjo';
    }
    engineRef.current.setActiveQuestTarget(targetId);
  }, [activeQuest.id, collectibles]);

  // Instantiate Engine3D
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new Engine3D(containerRef.current);
    engineRef.current = engine;

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      engine.handleResize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard bindings for PC controls
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          engine.controls.forward = true;
          break;
        case 's':
        case 'arrowdown':
          engine.controls.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          engine.controls.left = true;
          break;
        case 'd':
        case 'arrowright':
          engine.controls.right = true;
          break;
        case ' ':
          e.preventDefault();
          engine.controls.jump = true;
          break;
        case 'shift':
          engine.controls.sprint = true;
          break;
        case 'e':
        case 'enter':
          handleInteract();
          break;
        case 'tab':
        case 'b':
          e.preventDefault();
          setIsJournalOpen(prev => !prev);
          break;
        case 'm':
          e.preventDefault();
          setIsWorldSelectOpen(prev => !prev);
          break;
        case 'escape':
          setIsSettingsOpen(prev => !prev);
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          engine.controls.forward = false;
          break;
        case 's':
        case 'arrowdown':
          engine.controls.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          engine.controls.left = false;
          break;
        case 'd':
        case 'arrowright':
          engine.controls.right = false;
          break;
        case ' ':
          engine.controls.jump = false;
          break;
        case 'shift':
          engine.controls.sprint = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Poll nearby target from engine periodically (every 60ms)
    const proximityInterval = setInterval(() => {
      setNearbyTarget(engine.nearbyTarget);
    }, 60);

    return () => {
      clearInterval(proximityInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      engine.destroy();
    };
  }, []);

  // Handle Player Interaction
  const handleInteract = () => {
    const target = engineRef.current?.nearbyTarget || nearbyTarget;
    if (!target) return;
    sound.playClick();

    if (target.type === 'NPC') {
      const npc = target.entityData as NPCEntity;
      setActiveDialogueNPC(npc);

      // Select appropriate dialogue lines
      let lines = npc.dialogueTree.greeting;
      if (npc.id === 'npc-singgih' && activeQuest.id === 'quest-01-singgih') {
        lines = npc.dialogueTree.greeting;
      } else if (npc.id === 'npc-djiaw') {
        const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
        if (!hasPouch) {
          lines = npc.dialogueTree.questDialogue || npc.dialogueTree.greeting;
        } else {
          lines = npc.dialogueTree.completedDialogue || npc.dialogueTree.greeting;
        }
      } else if (npc.id === 'npc-soebardjo') {
        // Triggers timeline mini-game on finish
        lines = npc.dialogueTree.greeting;
      }

      setDialogueLines(lines);
    } else if (target.type === 'COLLECTIBLE') {
      const item = target.entityData as CollectibleItem;
      collectItem(item);
    } else if (target.type === 'CHEST') {
      // Open PETA Cipher Lock mini-game
      setActiveMiniGame({
        type: 'CIPHER',
        title: 'Peti Sandi Telegraf Komando PETA',
        instructions: 'Gembok komando ini disegel dengan sandi 4 digit. Petunjuk: Hari dan Bulan tibanya Bung Karno dan Bung Hatta di Rengasdengklok (Format DDMM).',
        isOpen: true
      });
    }
  };

  // Collect artifact handler
  const collectItem = (item: CollectibleItem) => {
    sound.playCollectible();
    addXP(75);
    unlockBadge('badge-first-explorer');

    // Update collectible state
    setCollectibles(prev => {
      const updated = prev.map(c => c.id === item.id ? { ...c, isFound: true } : c);
      if (updated.filter(c => c.isFound).length === updated.length) {
        unlockBadge('badge-history-hunter');
      }
      return updated;
    });

    // Remove 3D visual mesh from engine scene
    if (engineRef.current) {
      engineRef.current.removeCollectibleMesh(item.id);
    }

    // Check if item fulfills Quest 2 (Dispatch pouch)
    if (item.id === 'col-dispatch-pouch') {
      advanceActiveQuest();
    }
  };

  // Dialogue finish handler
  const handleDialogueFinish = () => {
    const speakerId = activeDialogueNPC?.id;
    setActiveDialogueNPC(null);
    setDialogueLines([]);

    if (speakerId === 'npc-singgih' && activeQuest.id === 'quest-01-singgih') {
      advanceActiveQuest();
    } else if (speakerId === 'npc-djiaw') {
      const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
      if (hasPouch && activeQuest.id === 'quest-02-dispatch') {
        advanceActiveQuest();
      }
    } else if (speakerId === 'npc-soekarno' && activeQuest.id === 'quest-04-veranda') {
      advanceActiveQuest();
    } else if (speakerId === 'npc-soebardjo') {
      // Launch Timeline mini-game
      setActiveMiniGame({
        type: 'TIMELINE',
        title: 'Kronologi Detik-Detik Menuju Proklamasi',
        instructions: 'Susun urutan peristiwa bersejarah 14-16 Agustus 1945 secara runtut untuk mengawal kepulangan rombongan proklamator ke Jakarta!',
        isOpen: true
      });
    }
  };

  // Mini-game success handler
  const handleMiniGameSuccess = () => {
    const gameType = activeMiniGame?.type;
    setActiveMiniGame(null);

    if (gameType === 'CIPHER') {
      addXP(150);
      advanceActiveQuest();
    } else if (gameType === 'TIMELINE') {
      addXP(200);
      advanceActiveQuest();
    } else if (gameType === 'ROLE_MATCH') {
      addXP(150);
    }
  };

  // Touch Direction input for Mobile
  const handleTouchDirection = (dx: number, dy: number) => {
    if (!engineRef.current) return;
    engineRef.current.controls.forward = dy < -0.3;
    engineRef.current.controls.backward = dy > 0.3;
    engineRef.current.controls.left = dx < -0.3;
    engineRef.current.controls.right = dx > 0.3;
  };

  const handleTouchJump = () => {
    if (!engineRef.current) return;
    engineRef.current.controls.jump = true;
    setTimeout(() => {
      if (engineRef.current) engineRef.current.controls.jump = false;
    }, 150);
  };

  const handleTouchSprint = (sprint: boolean) => {
    if (engineRef.current) engineRef.current.controls.sprint = sprint;
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const restartWorld = () => {
    if (engineRef.current) {
      engineRef.current.player.mesh.position.set(0, 0, 24);
      engineRef.current.playerVelocity.set(0, 0, 0);
    }
    setQuests(WORLD_01_QUESTS);
    setActiveQuestIndex(0);
    sound.playClick();
  };

  const collectiblesFoundCount = collectibles.filter(c => c.isFound).length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Modern Adventure HUD Overlay */}
      <HUDOverlay
        activeQuest={activeQuest}
        collectiblesFoundCount={collectiblesFoundCount}
        totalCollectiblesCount={collectibles.length}
        xp={xp}
        level={level}
        nearbyPrompt={nearbyTarget ? nearbyTarget.prompt : null}
        onInteract={handleInteract}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWorldSelect={() => setIsWorldSelectOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* NPC Dialogue Overlay */}
      <DialogueOverlay
        npc={activeDialogueNPC}
        dialogueLines={dialogueLines}
        onFinish={handleDialogueFinish}
        onClose={() => setActiveDialogueNPC(null)}
      />

      {/* Mini-Games Modal (Cipher, Timeline, Role Match) */}
      {activeMiniGame && activeMiniGame.isOpen && (
        <MiniGameModal
          gameData={activeMiniGame}
          onSuccess={handleMiniGameSuccess}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

      {/* Adventurer's Journal & Chronicle Compass */}
      {isJournalOpen && (
        <JournalModal
          quests={quests}
          collectibles={collectibles}
          badges={badges}
          xp={xp}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {/* World Selection Map Modal */}
      {isWorldSelectOpen && (
        <WorldSelectModal
          currentWorldId={currentWorldId}
          onSelectWorld={(worldId) => {
            setCurrentWorldId(worldId);
            setIsWorldSelectOpen(false);
          }}
          onClose={() => setIsWorldSelectOpen(false)}
        />
      )}

      {/* Settings / Pause Modal */}
      {isSettingsOpen && (
        <PauseSettingsModal
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onRestartWorld={restartWorld}
          onReturnToMenu={onReturnToTitle}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Grand Finale Level Complete Modal */}
      {isLevelCompleteOpen && (
        <LevelCompleteModal
          xp={xp}
          stars={stars}
          onContinueExplore={() => setIsLevelCompleteOpen(false)}
          onOpenWorldSelect={() => {
            setIsLevelCompleteOpen(false);
            setIsWorldSelectOpen(true);
          }}
          onReturnToTitle={onReturnToTitle}
        />
      )}

      {/* Responsive Touch Controls for Mobile/Tablet */}
      <TouchControls
        onDirectionChange={handleTouchDirection}
        onJump={handleTouchJump}
        onSprintToggle={handleTouchSprint}
        onInteract={handleInteract}
        hasNearbyTarget={!!nearbyTarget}
      />
    </div>
  );
};
