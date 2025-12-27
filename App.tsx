
import React, { useState, useEffect } from 'react';
import { QuizConfig, Question, QuizResult } from './types.ts';
import { generateQuiz, getAIResultFeedback } from './services/geminiService.ts';
import { QuizSetup } from './components/QuizSetup.tsx';
import { QuizCard } from './components/QuizCard.tsx';
import { ScoreBoard } from './components/ScoreBoard.tsx';

enum AppState {
  SETUP,
  LOADING,
  PLAYING,
  RESULTS
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizResult['answers']>([]);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);
  const [loadingLog, setLoadingLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLoadingLog(prev => [...prev.slice(-5), `> ${msg}`]);
  };

  const startQuiz = async (quizConfig: QuizConfig) => {
    setState(AppState.LOADING);
    setConfig(quizConfig);
    setLoadingLog(["Initializing CyberShell...", "Bypassing protocols..."]);
    
    try {
      addLog(`Searching targets: ${quizConfig.topic}`);
      const generatedQuestions = await generateQuiz(quizConfig);
      addLog("Data packets received.");
      addLog("Decrypting content...");
      
      setTimeout(() => {
        setQuestions(generatedQuestions);
        setCurrentIndex(0);
        setAnswers([]);
        setState(AppState.PLAYING);
      }, 800);
    } catch (error) {
      console.error("Failed to generate quiz", error);
      setState(AppState.SETUP);
    }
  };

  const handleNext = async (selected: string) => {
    const isCorrect = selected === questions[currentIndex].correctAnswer;
    const newAnswers = [...answers, { questionId: questions[currentIndex].id, selected, isCorrect }];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const score = newAnswers.filter(a => a.isCorrect).length;
      setState(AppState.LOADING);
      setLoadingLog(["Compiling results...", "Calculating sync rate..."]);
      
      try {
        const feedback = await getAIResultFeedback(score, questions.length, config?.topic || "");
        setFinalResult({
          score,
          total: questions.length,
          answers: newAnswers,
          aiComment: feedback
        });
        setState(AppState.RESULTS);
      } catch (e) {
        setFinalResult({ score, total: questions.length, answers: newAnswers });
        setState(AppState.RESULTS);
      }
    }
  };

  const restart = () => {
    setState(AppState.SETUP);
    setConfig(null);
    setQuestions([]);
    setFinalResult(null);
    setLoadingLog([]);
  };

  return (
    <div className="min-h-screen text-[#00ff41] flex flex-col py-12 px-4">
      <main className="flex-1 flex items-center justify-center relative z-10">
        {state === AppState.SETUP && (
          <QuizSetup onStart={startQuiz} isLoading={false} />
        )}

        {state === AppState.LOADING && (
          <div className="flex flex-col items-center gap-8 cyber-card p-12 w-full max-w-md bg-black/80">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-[#00ff41]/20 border-t-[#00ff41] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold animate-pulse">
                UPLINK
              </div>
            </div>
            <div className="w-full font-mono text-left">
              {loadingLog.map((log, i) => (
                <p key={i} className="text-[10px] text-[#00ff41]/60 leading-tight">
                  {log}
                </p>
              ))}
              <div className="w-full bg-[#00ff41]/10 h-1 mt-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#00ff41] animate-[progress_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.PLAYING && questions.length > 0 && (
          <QuizCard 
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            total={questions.length}
            onNext={handleNext}
          />
        )}

        {state === AppState.RESULTS && finalResult && (
          <ScoreBoard result={finalResult} onRestart={restart} />
        )}
      </main>

      <footer className="mt-12 text-center text-[#00ff41]/20 text-[10px] font-mono tracking-widest relative z-10">
        [SYSTEM_STATUS: STABLE] // [CONNECTION: ENCRYPTED] // [MODEL: GEMINI-3-FLASH]
      </footer>

      <style>{`
        @keyframes progress {
          0% { width: 0%; left: -100%; }
          50% { width: 30%; }
          100% { width: 100%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
