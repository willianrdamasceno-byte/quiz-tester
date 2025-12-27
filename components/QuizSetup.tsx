
import React, { useState } from 'react';
import { QuizConfig } from '../types.ts';
import { Button } from './Button.tsx';
import { Terminal, Cpu, Network, ShieldCheck, Code, Settings, Database } from 'lucide-react';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuizConfig['difficulty']>('intermediária');
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart({ topic, difficulty, count });
  };

  const itCategories = [
    { name: 'Hardware', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Redes', icon: <Network className="w-3 h-3" /> },
    { name: 'Segurança', icon: <ShieldCheck className="w-3 h-3" /> },
    { name: 'Code', icon: <Code className="w-3 h-3" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full p-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-2 glitch tracking-tighter" data-text="CYBERSHELL">
          CYBERSHELL
        </h1>
        <div className="flex justify-center items-center gap-3 text-[10px] text-[#00ff41]/40 uppercase tracking-[0.4em]">
          <span className="w-8 h-px bg-[#00ff41]/20"></span>
          Knowledge Extraction Interface
          <span className="w-8 h-px bg-[#00ff41]/20"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cyber-card p-10 space-y-10">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[11px] font-bold text-[#00ff41] opacity-70 tracking-widest uppercase">
            <Terminal className="w-3 h-3" /> [1] Select_Target_Topic
          </label>
          <div className="relative group">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Arquitetura x86, Python, Firewall..."
              className="w-full bg-black/50 border border-[#00ff41]/20 p-5 text-[#00ff41] focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/20 transition-all placeholder:text-[#00ff41]/10 font-mono text-lg"
              required
            />
            <div className="absolute top-0 right-4 h-full flex items-center">
              <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {itCategories.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTopic(t.name)}
                className="flex items-center gap-2 px-4 py-2 bg-black border border-[#00ff41]/10 text-[10px] text-[#00ff41]/60 hover:border-[#00ff41] hover:text-[#00ff41] transition-all uppercase font-bold"
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-bold text-[#00ff41] opacity-70 tracking-widest uppercase">
              <Settings className="w-3 h-3" /> [2] System_Level
            </label>
            <div className="flex flex-col gap-1">
              {(['básica', 'intermediária', 'avançada'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 text-[10px] text-left border transition-all uppercase font-bold flex justify-between items-center ${
                    difficulty === level 
                      ? 'bg-[#00ff41] text-black border-[#00ff41]' 
                      : 'border-[#00ff41]/10 text-[#00ff41]/40 hover:border-[#00ff41]/40'
                  }`}
                >
                  {level}
                  {difficulty === level && <span className="text-[8px]">ACTIVE</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-bold text-[#00ff41] opacity-70 tracking-widest uppercase">
              {/* Added missing Database component from lucide-react */}
              <Database className="w-3 h-3" /> [3] Data_Buffer: {count}
            </label>
            <div className="pt-4">
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#00ff41]/10 h-1 rounded-full"
              />
              <div className="flex justify-between mt-2 text-[9px] text-[#00ff41]/30 font-bold uppercase">
                <span>Min_Packets</span>
                <span>Max_Packets</span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          fullWidth 
          type="submit" 
          disabled={isLoading || !topic.trim()}
          className="py-6 text-base tracking-[0.3em]"
        >
          {isLoading ? 'ESTABLISHING_UPLINK...' : 'INITIALIZE_CHALLENGE'}
        </Button>
      </form>
    </div>
  );
};
