
import React from 'react';
import { QuizResult } from '../types.ts';
import { Button } from './Button.tsx';
import { Terminal, Lock, Unlock, Database } from 'lucide-react';

interface ScoreBoardProps {
  result: QuizResult;
  onRestart: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ result, onRestart }) => {
  const percentage = Math.round((result.score / result.total) * 100);
  
  const getStatus = () => {
    if (percentage === 100) return "SUDO_ROOT_ACCESS";
    if (percentage >= 70) return "POWER_USER";
    if (percentage >= 50) return "SCRIPT_KIDDIE";
    return "GUEST_LIMITED";
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6 animate-in fade-in zoom-in-90 duration-500">
      <div className="cyber-card p-10 bg-black border-2 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            {percentage >= 70 ? (
              <Unlock className="w-20 h-20 text-[#00ff41] animate-pulse" />
            ) : (
              <Lock className="w-20 h-20 text-red-500 animate-pulse" />
            )}
            <div className="absolute -top-2 -right-2 bg-[#bc13fe] text-white p-1 rounded">
              <Database className="w-4 h-4" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase glitch" data-text={getStatus()}>
          {getStatus()}
        </h1>
        <p className="text-[#00ff41]/50 text-[10px] mb-8 uppercase tracking-[0.2em]">Data Injection Completed Successfully</p>

        <div className="flex justify-around mb-10 border-y border-[#00ff41]/10 py-6">
          <div>
            <div className="text-4xl font-black text-[#00ff41]">{result.score}/{result.total}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Nodes_Captured</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#bc13fe]">{percentage}%</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Sync_Rate</div>
          </div>
        </div>

        {result.aiComment && (
          <div className="text-left bg-gray-900/50 p-4 border-l-2 border-[#bc13fe] mb-10">
            <div className="flex items-center gap-2 mb-2 text-[#bc13fe] font-bold text-[10px] uppercase">
              <Terminal className="w-3 h-3" />
              Root@Admin Feedback
            </div>
            <p className="text-gray-300 text-sm italic font-mono">
              "{result.aiComment}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={onRestart} fullWidth>
            REBOOT_SYSTEM
          </Button>
          <Button variant="secondary" fullWidth onClick={() => window.print()}>
            EXPORT_LOGS
          </Button>
        </div>
      </div>
    </div>
  );
};
