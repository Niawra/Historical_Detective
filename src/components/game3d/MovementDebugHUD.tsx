import React from 'react';
import { WorldBuilder } from '../../game3d/WorldBuilder';

export interface DebugTelemetryData {
  keys: {
    W: boolean;
    A: boolean;
    S: boolean;
    D: boolean;
    SPACE: boolean;
    SHIFT: boolean;
  };
  pos: {
    x: number;
    y: number;
    z: number;
  };
  velocity: {
    vx: number;
    vy: number;
    vz: number;
  };
  speed: number;
  isGrounded: boolean;
  isMoving: boolean;
  animState: string;
  collisionEnabled: boolean;
  cameraYaw: number;
  cameraPitch: number;
  cameraDist: number;
}

interface MovementDebugHUDProps {
  telemetry: DebugTelemetryData | null;
  isOpen: boolean;
  onToggle: () => void;
  onPressDirection: (dir: 'W' | 'A' | 'S' | 'D' | 'SPACE' | 'SHIFT', active: boolean) => void;
  onToggleCollision: () => void;
}

export const MovementDebugHUD: React.FC<MovementDebugHUDProps> = ({
  telemetry,
  isOpen,
  onToggle,
  onPressDirection,
  onToggleCollision
}) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-2 left-2 z-40 px-2.5 py-1 rounded-md bg-black/70 hover:bg-black/90 text-[10px] font-mono text-amber-400 border border-amber-500/40 shadow-lg pointer-events-auto transition"
        title="Toggle Movement Debugger (F3)"
      >
        🛠️ Debugger (F3)
      </button>
    );
  }

  if (!telemetry) return null;

  const { keys, pos, velocity, isGrounded, isMoving, animState, collisionEnabled } = telemetry;

  return (
    <div className="fixed bottom-2 left-2 z-40 w-80 bg-black/90 backdrop-blur-md border border-amber-500/70 rounded-xl p-3 font-mono text-[11px] text-white shadow-2xl pointer-events-auto select-none">
      {/* Title & Close */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
        <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
          <span>🛠️ MOVEMENT DEBUGGER</span>
          <span className="text-[9px] text-white/50 font-normal">[F3]</span>
        </div>
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white px-1 rounded text-xs"
        >
          ✕
        </button>
      </div>

      {/* 1. Live Key Inputs */}
      <div className="mb-2">
        <span className="text-[10px] text-white/60 block mb-1">INPUT KEYBOARD (WASD / Panah):</span>
        <div className="grid grid-cols-4 gap-1 text-center font-bold">
          <div className={`py-1 rounded border ${keys.W ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            W: {keys.W ? 'ON' : 'off'}
          </div>
          <div className={`py-1 rounded border ${keys.A ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            A: {keys.A ? 'ON' : 'off'}
          </div>
          <div className={`py-1 rounded border ${keys.S ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            S: {keys.S ? 'ON' : 'off'}
          </div>
          <div className={`py-1 rounded border ${keys.D ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            D: {keys.D ? 'ON' : 'off'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-center font-bold mt-1">
          <div className={`py-1 rounded border ${keys.SPACE ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            SPACE: {keys.SPACE ? 'JUMP' : 'off'}
          </div>
          <div className={`py-1 rounded border ${keys.SHIFT ? 'bg-amber-600 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
            SHIFT: {keys.SHIFT ? 'SPRINT' : 'walk'}
          </div>
        </div>
      </div>

      {/* 2. Coordinates & Physics Telemetry */}
      <div className="bg-white/5 rounded-lg p-2 mb-2 space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-white/60">Position (X, Y, Z):</span>
          <span className="text-amber-300 font-bold">{pos.x}, {pos.y}, {pos.z}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Velocity (Vx, Vy, Vz):</span>
          <span className="text-cyan-300">{velocity.vx}, {velocity.vy}, {velocity.vz}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Moving / Anim:</span>
          <span>
            <strong className={isMoving ? 'text-emerald-400' : 'text-white/50'}>
              {isMoving ? 'MOVING' : 'IDLE'}
            </strong>
            <span className="text-white/40"> • </span>
            <span className="text-amber-200">{animState}</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Grounded:</span>
          <span className={isGrounded ? 'text-emerald-400' : 'text-rose-400'}>
            {isGrounded ? 'YES (On Ground)' : 'IN AIR'}
          </span>
        </div>
      </div>

      {/* 3. Collision Diagnostics & Override */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 mb-2">
        <span className="text-[10px] text-white/70">Sistem Collision:</span>
        <button
          onClick={onToggleCollision}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
            collisionEnabled 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 hover:bg-emerald-900' 
              : 'bg-rose-950/80 border-rose-500 text-rose-300 hover:bg-rose-900'
          }`}
        >
          {collisionEnabled ? 'AKTIF (ON)' : 'NONAKTIF (OFF)'}
        </button>
      </div>

      {/* 4. Mouse-Clickable Test Controls */}
      <div className="border-t border-white/10 pt-2">
        <span className="text-[9px] text-white/50 block mb-1">KLIK MANUAL UNTUK TEST:</span>
        <div className="flex justify-center mb-1">
          <button
            onMouseDown={() => onPressDirection('W', true)}
            onMouseUp={() => onPressDirection('W', false)}
            onMouseLeave={() => onPressDirection('W', false)}
            onTouchStart={() => onPressDirection('W', true)}
            onTouchEnd={() => onPressDirection('W', false)}
            className="w-10 h-7 rounded bg-white/10 hover:bg-amber-500 hover:text-black font-bold border border-white/20 active:scale-95 transition"
          >
            ▲ W
          </button>
        </div>
        <div className="flex justify-center space-x-1">
          <button
            onMouseDown={() => onPressDirection('A', true)}
            onMouseUp={() => onPressDirection('A', false)}
            onMouseLeave={() => onPressDirection('A', false)}
            onTouchStart={() => onPressDirection('A', true)}
            onTouchEnd={() => onPressDirection('A', false)}
            className="w-10 h-7 rounded bg-white/10 hover:bg-amber-500 hover:text-black font-bold border border-white/20 active:scale-95 transition"
          >
            ◀ A
          </button>
          <button
            onMouseDown={() => onPressDirection('S', true)}
            onMouseUp={() => onPressDirection('S', false)}
            onMouseLeave={() => onPressDirection('S', false)}
            onTouchStart={() => onPressDirection('S', true)}
            onTouchEnd={() => onPressDirection('S', false)}
            className="w-10 h-7 rounded bg-white/10 hover:bg-amber-500 hover:text-black font-bold border border-white/20 active:scale-95 transition"
          >
            ▼ S
          </button>
          <button
            onMouseDown={() => onPressDirection('D', true)}
            onMouseUp={() => onPressDirection('D', false)}
            onMouseLeave={() => onPressDirection('D', false)}
            onTouchStart={() => onPressDirection('D', true)}
            onTouchEnd={() => onPressDirection('D', false)}
            className="w-10 h-7 rounded bg-white/10 hover:bg-amber-500 hover:text-black font-bold border border-white/20 active:scale-95 transition"
          >
            ▶ D
          </button>
        </div>
      </div>
    </div>
  );
};
