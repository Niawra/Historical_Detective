import React from 'react';

interface TouchControlsProps {
  onDirectionChange: (dx: number, dy: number) => void;
  onJump: () => void;
  onSprintToggle: (sprinting: boolean) => void;
  onInteract: () => void;
  hasNearbyTarget: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionChange,
  onJump,
  onSprintToggle,
  onInteract,
  hasNearbyTarget
}) => {
  return (
    <div className="absolute inset-x-0 bottom-4 pointer-events-none z-30 px-6 flex items-end justify-between sm:hidden select-none">
      {/* Virtual D-Pad (Left) */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-36 h-36 p-1.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/20">
        <div />
        <button
          onTouchStart={() => onDirectionChange(0, -1)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          className="rounded-xl bg-[#2a221a]/80 active:bg-amber-500 active:text-black border border-white/20 text-white font-bold text-sm flex items-center justify-center"
        >
          ▲
        </button>
        <div />
        <button
          onTouchStart={() => onDirectionChange(-1, 0)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          className="rounded-xl bg-[#2a221a]/80 active:bg-amber-500 active:text-black border border-white/20 text-white font-bold text-sm flex items-center justify-center"
        >
          ◀
        </button>
        <div className="flex items-center justify-center text-[10px] text-parchment-500 font-mono">D-Pad</div>
        <button
          onTouchStart={() => onDirectionChange(1, 0)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          className="rounded-xl bg-[#2a221a]/80 active:bg-amber-500 active:text-black border border-white/20 text-white font-bold text-sm flex items-center justify-center"
        >
          ▶
        </button>
        <div />
        <button
          onTouchStart={() => onDirectionChange(0, 1)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          className="rounded-xl bg-[#2a221a]/80 active:bg-amber-500 active:text-black border border-white/20 text-white font-bold text-sm flex items-center justify-center"
        >
          ▼
        </button>
        <div />
      </div>

      {/* Action Buttons (Right) */}
      <div className="pointer-events-auto flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-3">
          {/* Sprint Toggle */}
          <button
            onTouchStart={() => onSprintToggle(true)}
            onTouchEnd={() => onSprintToggle(false)}
            className="w-13 h-13 rounded-full bg-[#2a221a]/85 active:bg-amber-500 active:text-black border border-white/25 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg"
          >
            ⚡ Lari
          </button>

          {/* Jump Button */}
          <button
            onClick={onJump}
            className="w-14 h-14 rounded-full bg-[#2a221a]/85 active:bg-amber-500 active:text-black border border-white/25 text-white font-mono font-bold text-base flex items-center justify-center shadow-lg"
          >
            ⬆ Lompat
          </button>
        </div>

        {/* Big Interact Button */}
        {hasNearbyTarget && (
          <button
            onClick={onInteract}
            className="w-18 h-18 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono font-black text-xl shadow-2xl flex flex-col items-center justify-center border-2 border-white animate-pulse"
          >
            <span>E</span>
            <span className="text-[9px] uppercase tracking-wider -mt-0.5">Aksi</span>
          </button>
        )}
      </div>
    </div>
  );
};
