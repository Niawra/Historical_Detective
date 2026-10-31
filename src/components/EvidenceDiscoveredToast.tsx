import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { Sparkles, Eye, X, CheckCircle2 } from 'lucide-react';

export const EvidenceDiscoveredToast: React.FC = () => {
  const { evidenceNotification, dismissEvidenceNotification, inspectEvidence } = useGame();

  if (!evidenceNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-parchment-100 text-detective-900 rounded-lg p-4 shadow-dossier border-4 border-seal-red animate-bounce select-none">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-seal-red font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>BUKTI SEJARAH DITEMUKAN!</span>
        </div>

        <button
          onClick={dismissEvidenceNotification}
          className="text-detective-500 hover:text-detective-950 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2 font-serif">
        <h4 className="font-bold text-sm text-detective-950 line-clamp-1">
          {evidenceNotification.title}
        </h4>
        <p className="text-xs text-detective-700 mt-0.5 line-clamp-2">
          {evidenceNotification.shortDesc}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-detective-900/10 flex items-center justify-between">
        <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
          Tersimpan di Arsip
        </span>

        <button
          onClick={() => {
            inspectEvidence(evidenceNotification);
            dismissEvidenceNotification();
          }}
          className="px-3 py-1 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold flex items-center space-x-1 shadow-sm transition"
        >
          <Eye className="w-3 h-3" />
          <span>Buka Berkas</span>
        </button>
      </div>
    </div>
  );
};
