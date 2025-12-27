
import React, { useState, useEffect } from 'react';
import { Question } from '../types.ts';
import { Button } from './Button.tsx';
import { Terminal, Cpu, Info, ChevronRight } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  total: number;
  onNext: (selectedAnswer: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  currentIndex, 
  total, 
  onNext 
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
  }, [question]);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setShowResult(true);
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-6 animate-in slide-in-from-right duration-300">
      <div className="mb-10 cyber-card p-6 border-b-0 border-r-0 border-t-0 bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-[10px] text-[#00ff41] font-bold uppercase tracking-widest">
            <Cpu className="w-4 h-4" />
            Packet_{currentIndex + 1}_of_{total}
          </div>
          <div className="text-[9px] text-[#00ff41]/30 font-mono">
            TIMESTAMP: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
          <span className="text-[#00ff41]/50 mr-3">$</span>
          {question.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {question.options.map((option, idx) => {
          let stateStyles = "border-[#00ff41]/10 text-[#00ff41]/50 hover:border-[#00ff41]/50 hover:bg-[#00ff41]/5";
          
          if (selected === option) {
            stateStyles = "border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.1)]";
          }

          if (showResult) {
            if (option === question.correctAnswer) {
              stateStyles = "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
            } else if (selected === option) {
              stateStyles = "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
            } else {
              stateStyles = "border-gray-900 text-gray-800 opacity-40 grayscale";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={`w-full text-left p-5 border-2 transition-all duration-200 flex items-center gap-6 group relative overflow-hidden ${stateStyles}`}
            >
              <div className="w-8 h-8 flex items-center justify-center border border-current text-[10px] font-black">
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-bold text-sm tracking-tight">{option}</span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="border border-[#bc13fe]/30 bg-[#bc13fe]/5 p-6 mb-10 animate-in slide-in-from-top-2 border-l-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#bc13fe]/10 rounded">
              <Info className="w-4 h-4 text-[#bc13fe]" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#bc13fe] mb-2 uppercase tracking-widest">[DEBUG_LOGS]</span>
              <p className="text-gray-300 text-xs leading-relaxed font-mono italic">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        {!showResult ? (
          <Button onClick={handleConfirm} disabled={!selected} className="min-w-[200px]">
            VALIDATE_INPUT
          </Button>
        ) : (
          <Button onClick={() => onNext(selected!)} className="min-w-[200px]">
            {currentIndex + 1 === total ? 'COMPILE_RESULTS' : 'NEXT_DATA_STREAM'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
