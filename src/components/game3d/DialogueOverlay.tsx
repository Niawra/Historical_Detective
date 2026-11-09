import React, { useState, useEffect } from 'react';
import { NPCEntity } from '../../types';
import { sound } from '../../utils/audio';
import { MessageSquare, ArrowRight, X, Sparkles } from 'lucide-react';

interface DialogueOverlayProps {
  npc: NPCEntity | null;
  dialogueLines: string[];
  onFinish: () => void;
  onClose: () => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  npc,
  dialogueLines,
  onFinish,
  onClose
}) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setLineIndex(0);
    sound.playDialogueBlip();
  }, [npc, dialogueLines]);

  if (!npc || dialogueLines.length === 0) return null;

  const currentText = dialogueLines[lineIndex] || '';
  const isLast = lineIndex === dialogueLines.length - 1;

  const handleNext = () => {
    sound.playDialogueBlip();
    if (!isLast) {
      setLineIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const getAvatarIcon = (style: string) => {
    switch (style) {
      case 'peta': return '💂';
      case 'farmer': return '👴';
      case 'soekarno': return '🇮🇩';
      case 'hatta': return '👓';
      case 'diplomat': return '🎩';
      default: return '👤';
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#1b1510]/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl text-parchment-100 flex flex-col justify-between mb-4 sm:mb-0">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-2xl shadow-inner">
              {getAvatarIcon(npc.modelStyle)}
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg text-amber-300">
                {npc.name}
              </h3>
              <span className="font-mono text-[11px] text-parchment-400 block">
                {npc.role}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-amber-400/80">
              {lineIndex + 1} / {dialogueLines.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dialogue Body */}
        <div className="my-2 min-h-[64px]">
          <p className="font-serif text-sm sm:text-base text-parchment-100 leading-relaxed">
            {currentText}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-parchment-800/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-parchment-500 hidden sm:inline">
            Tekan [Lanjut] atau tombol [Spasi]
          </span>

          <button
            onClick={handleNext}
            className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs tracking-wider shadow-lg transition flex items-center space-x-2"
          >
            <span>{isLast ? 'SELESAI BICARA' : 'LANJUTKAN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
