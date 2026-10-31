import React from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { MessageSquare, ArrowRight, X } from 'lucide-react';

export const DialogueBox: React.FC = () => {
  const { activeDialogue, advanceDialogue, closeDialogue } = useAdventure();

  if (!activeDialogue) return null;

  const currentLine = activeDialogue.lines[activeDialogue.currentLineIndex] || '';
  const isLastLine = activeDialogue.currentLineIndex === activeDialogue.lines.length - 1;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-fade-in select-none">
      <div className="bg-[#1b1510]/95 backdrop-blur-md border-2 border-amber-600/80 rounded-2xl p-5 sm:p-6 shadow-2xl text-parchment-100 flex flex-col justify-between relative">
        {/* Speaker Name Badge */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-2.5 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h4 className="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider">
              {activeDialogue.speaker}
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-parchment-500">
              {activeDialogue.currentLineIndex + 1} / {activeDialogue.lines.length}
            </span>
            <button
              onClick={closeDialogue}
              className="text-parchment-500 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dialogue Text */}
        <p className="font-serif text-sm sm:text-base text-parchment-100 leading-relaxed min-h-[50px] my-1">
          {currentLine}
        </p>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-parchment-800/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-parchment-500 hidden sm:inline">
            Klik tombol Lanjut atau tekan [Spasi]
          </span>

          <button
            onClick={advanceDialogue}
            className="ml-auto px-5 py-2 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition flex items-center space-x-2 shadow-md"
          >
            <span>{isLastLine ? 'SELESAI BICARA' : 'LANJUT'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
