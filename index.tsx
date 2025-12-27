
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Terminal, Cpu, Network, ShieldCheck, 
  Code, Settings, Database, ChevronRight, 
  Lock, Unlock, AlertTriangle, RefreshCw, Info
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- TIPOS ---
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizConfig {
  topic: string;
  difficulty: 'básica' | 'intermediária' | 'avançada';
  count: number;
}

// --- SERVIÇO DE IA ---
const fetchQuestionsFromAI = async (config: QuizConfig): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Gere um quiz técnico hacker sobre "${config.topic}". 
  Nível de dificuldade: ${config.difficulty}. 
  Quantidade de perguntas: ${config.count}.
  Obrigatório: Retorne apenas um array JSON. Cada objeto deve ter: question (string), options (array de 4 strings), correctAnswer (string igual à correta) e explanation (string explicativa sarcástica).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.map((q: any, i: number) => ({ ...q, id: `q-${i}-${Date.now()}` }));
  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("Falha ao estabelecer conexão com a rede neural.");
  }
};

// --- COMPONENTES ---

const CyberButton = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const styles: any = {
    primary: "border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black shadow-[0_0_10px_rgba(0,255,65,0.2)]",
    secondary: "border-[#bc13fe] text-[#bc13fe] hover:bg-[#bc13fe] hover:text-black shadow-[0_0_10px_rgba(188,19,254,0.2)]",
    danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
  };
  return (
    <button className={`border-2 px-6 py-4 font-bold uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SetupView = ({ onStart, isLoading }: any) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'básica' | 'intermediária' | 'avançada'>('intermediária');
  const [count, setCount] = useState(5);

  const itCategories = [
    { name: 'Hardware', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Redes', icon: <Network className="w-3 h-3" /> },
    { name: 'Linux', icon: <Code className="w-3 h-3" /> },
    { name: 'CyberSec', icon: <ShieldCheck className="w-3 h-3" /> },
  ];

  return (
    <div className="max-w-xl w-full p-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-black mb-2 tracking-tighter glitch-text italic">CYBERSHELL</h1>
        <p className="text-[9px] opacity-40 tracking-[0.5em] uppercase">Security Knowledge Extraction v3.1</p>
      </div>

      <div className="cyber-card p-8 space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-bold flex items-center gap-2 uppercase text-[#00ff41]/60">
            <Terminal size={14}/> [01] Inserir_Assunto_Alvo
          </label>
          <input 
            className="w-full bg-black/60 border border-[#00ff41]/30 p-5 text-[#00ff41] focus:border-[#00ff41] outline-none font-mono text-lg transition-all"
            placeholder="Ex: Python, Firewall, Redes..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {itCategories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setTopic(cat.name)}
                className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-[#00ff41]/10 text-[9px] text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41] transition-all uppercase font-bold"
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold flex items-center gap-2 uppercase text-[#00ff41]/60">
              <Settings size={14}/> [02] Complexidade
            </label>
            <div className="flex flex-col gap-2">
              {(['básica', 'intermediária', 'avançada'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`p-3 text-[10px] text-left border font-bold uppercase transition-all flex justify-between items-center ${
                    difficulty === lvl ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-[#00ff41]/20 text-[#00ff41]/40 hover:border-[#00ff41]/60'
                  }`}
                >
                  {lvl} {difficulty === lvl && <ChevronRight size={12}/>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold flex items-center gap-2 uppercase text-[#00ff41]/60">
              <Database size={14}/> [03] Packets: {count}
            </label>
            <input 
              type="range" min="3" max="10" value={count} 
              onChange={e => setCount(parseInt(e.target.value))}
              className="w-full h-1 bg-[#00ff41]/10 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[8px] opacity-30 font-bold uppercase">
              <span>Min_3</span>
              <span>Max_10</span>
            </div>
          </div>
        </div>

        <CyberButton 
          className="w-full py-6 text-sm" 
          disabled={!topic || isLoading}
          onClick={() => onStart({ topic, difficulty, count })}
        >
          {isLoading ? "ESTABLISHING_UPLINK..." : "INICIAR_EXTRAÇÃO_DADOS"}
        </CyberButton>
      </div>
    </div>
  );
};

const QuizView = ({ question, index, total, onAnswer }: any) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question]);

  return (
    <div className="max-w-2xl w-full p-6 animate-in slide-in-from-right duration-500">
      <div className="mb-6 flex justify-between items-end border-b border-[#00ff41]/20 pb-4">
        <div>
          <span className="text-[10px] font-bold block mb-1 text-[#00ff41]/60">SEQUENCE: {index+1}/{total}</span>
          <h2 className="text-2xl font-black text-white">{question.question}</h2>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((opt: string, i: number) => {
          let color = "border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/60";
          if(selected === opt) color = "border-[#00ff41] bg-[#00ff41]/5 text-[#00ff41]";
          
          if(revealed) {
            if(opt === question.correctAnswer) color = "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
            else if(selected === opt) color = "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
            else color = "border-gray-900 text-gray-800 opacity-20";
          }

          return (
            <button 
              key={i}
              disabled={revealed}
              onClick={() => setSelected(opt)}
              className={`w-full text-left p-5 border-2 font-bold text-sm transition-all flex items-center gap-6 ${color}`}
            >
              <div className="w-7 h-7 flex items-center justify-center border border-current text-[10px]">{String.fromCharCode(65 + i)}</div>
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="bg-[#bc13fe]/5 border-l-4 border-[#bc13fe] p-6 mb-8 animate-in slide-in-from-top border-y border-y-[#bc13fe]/10">
          <div className="flex items-center gap-2 mb-2 text-[#bc13fe]">
            <Info size={14}/>
            <span className="text-[10px] font-bold uppercase tracking-widest">Análise_IA:</span>
          </div>
          <p className="text-xs italic text-gray-300 font-mono leading-relaxed">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!revealed ? (
          <CyberButton onClick={() => setRevealed(true)} disabled={!selected}>VALIDAR_DADOS</CyberButton>
        ) : (
          <CyberButton onClick={() => onAnswer(selected === question.correctAnswer)}>
            {index + 1 === total ? 'FINALIZAR_SESSÃO' : 'PRÓXIMO_PROTOLO'} <ChevronRight size={16}/>
          </CyberButton>
        )}
      </div>
    </div>
  );
};

const ResultView = ({ score, total, onRestart }: any) => {
  const rate = Math.round((score/total)*100);
  return (
    <div className="max-w-md w-full cyber-card p-12 text-center animate-in zoom-in duration-500">
      <div className="mb-8 flex justify-center">
        {rate >= 70 ? <Unlock size={80} className="text-[#00ff41] animate-pulse"/> : <Lock size={80} className="text-red-500"/>}
      </div>
      <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter">Sincronia: {rate}%</h2>
      <p className="text-[10px] opacity-40 mb-10 tracking-[0.4em] uppercase">Métricas_Processadas</p>
      
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-5 border border-[#00ff41]/20 bg-[#00ff41]/5">
          <p className="text-4xl font-black">{score}/{total}</p>
          <p className="text-[8px] uppercase font-bold text-gray-500 mt-2 tracking-widest">Nodes_Capturados</p>
        </div>
        <div className="p-5 border border-[#bc13fe]/20 bg-[#bc13fe]/5">
          <p className="text-4xl font-black text-[#bc13fe]">{rate < 70 ? 'FAIL' : 'PASS'}</p>
          <p className="text-[8px] uppercase font-bold text-gray-500 mt-2 tracking-widest">Status_Terminal</p>
        </div>
      </div>

      <CyberButton className="w-full" onClick={onRestart}>REINICIAR_TERMINAL</CyberButton>
    </div>
  );
};

// --- APP PRINCIPAL ---

const App = () => {
  const [view, setView] = useState('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLoadingLogs(prev => [...prev.slice(-3), `> ${msg}`]);
  };

  const handleStart = async (config: QuizConfig) => {
    setLoading(true);
    setError(null);
    setLoadingLogs(["Iniciando protocolos de extração...", `Alvo: ${config.topic}`]);
    
    try {
      addLog("Estabelecendo conexão com o Gemini...");
      const q = await fetchQuestionsFromAI(config);
      addLog("Pacotes de dados recebidos.");
      addLog("Descriptografando conteúdo...");
      
      setTimeout(() => {
        setQuestions(q);
        setScore(0);
        setCurrent(0);
        setView('quiz');
        setLoading(false);
      }, 1000);
    } catch (e: any) {
      setError(e.message || "Erro crítico no Uplink.");
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if(isCorrect) setScore(s => s + 1);
    if(current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      setView('result');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {view === 'setup' && !loading && <SetupView onStart={handleStart} isLoading={loading} />}
      
      {loading && (
        <div className="max-w-md w-full cyber-card p-10 flex flex-col items-center gap-8 animate-pulse">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#00ff41]/20 border-t-[#00ff41] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">SCANNING</div>
          </div>
          <div className="w-full space-y-2 font-mono text-[10px] text-[#00ff41]/60">
            {loadingLogs.map((log, i) => <p key={i}>{log}</p>)}
            <div className="w-full bg-[#00ff41]/10 h-1 mt-4 overflow-hidden">
              <div className="h-full bg-[#00ff41] animate-[progress_2s_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && !loading && (
        <QuizView 
          question={questions[current]} 
          index={current} 
          total={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {view === 'result' && !loading && (
        <ResultView 
          score={score} 
          total={questions.length} 
          onRestart={() => setView('setup')} 
        />
      )}

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-950 border-2 border-red-500 p-5 flex items-center gap-4 text-red-200 z-[5000] shadow-2xl">
          <AlertTriangle className="text-red-500" size={24}/>
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">System_Failure</p>
            <p className="text-xs font-bold">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-4 hover:text-white">
            <RefreshCw size={16}/>
          </button>
        </div>
      )}

      <footer className="fixed bottom-4 left-4 text-[8px] opacity-20 font-mono hidden md:block uppercase tracking-widest">
        [SYS_STATUS: ACTIVE] // [UPLINK: GEMINI-3] // [ENCRYPTION: AES-256]
      </footer>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
