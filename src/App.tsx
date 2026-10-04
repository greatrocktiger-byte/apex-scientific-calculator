/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { CalculatorEngine } from './calculator/engine.ts';
import { HistoryItem } from './calculator/types.ts';
import { sound } from './calculator/sound.ts';
import { Display } from './components/Display.tsx';
import { Keypad } from './components/Keypad.tsx';
import { HistoryPanel } from './components/HistoryPanel.tsx';
import { ConstantsSheet } from './components/ConstantsSheet.tsx';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.tsx';
import {
  Volume2,
  VolumeX,
  Keyboard,
  History as HistoryIcon,
  Calculator as CalcIcon,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [engine] = useState(() => new CalculatorEngine(true));
  const [expression, setExpression] = useState<string>('0');
  const [previousExpr, setPreviousExpr] = useState<string>('');
  const [isDegMode, setIsDegMode] = useState<boolean>(true);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => sound.isSoundEnabled());
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'calc' | 'history' | 'constants'>('calc');
  const [desktopTab, setDesktopTab] = useState<'history' | 'constants'>('history');

  // Load history from localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('apex_calc_history');
        if (saved) return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apex_calc_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Keep engine DEG/RAD mode synchronized
  useEffect(() => {
    engine.setDegMode(isDegMode);
  }, [isDegMode, engine]);

  // Key insertion
  const handleInsert = useCallback(
    (s: string) => {
      setErrorMessage(null);
      setExpression((cur) => {
        let next = cur;
        if (justEvaluated) {
          if (/^[0-9.\u03c0]$/.test(s) || s === 'π' || s === 'e') {
            next = '0';
            setPreviousExpr('');
          }
          setJustEvaluated(false);
        }

        if (next === '0' && /^[0-9.]$/.test(s)) {
          return s === '00' ? '0' : s;
        } else if (next === '0' && s.startsWith('^')) {
          return '0' + s;
        } else if (next === '0' && (s === '!' || s === '%')) {
          return '0' + s;
        } else if (next === '0' && !['+', '-', '*', '/', '%', '^'].includes(s)) {
          return s;
        } else {
          return next + s;
        }
      });
    },
    [justEvaluated]
  );

  // Backspace
  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    setJustEvaluated(false);
    setExpression((cur) => {
      if (cur.length <= 1) return '0';
      const funcs = ['asin(', 'acos(', 'atan(', 'cbrt(', 'sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'ln('];
      for (const fn of funcs) {
        if (cur.endsWith(fn)) {
          const stripped = cur.slice(0, -fn.length);
          return stripped.length === 0 ? '0' : stripped;
        }
      }
      return cur.slice(0, -1);
    });
  }, []);

  // Clear All (C)
  const handleClear = useCallback(() => {
    setExpression('0');
    setPreviousExpr('');
    setErrorMessage(null);
    setJustEvaluated(false);
  }, []);

  // Negate ±
  const handleNegate = useCallback(() => {
    setErrorMessage(null);
    setExpression((cur) => {
      if (cur === '0') return '0';
      if (cur.startsWith('-')) {
        return cur.slice(1);
      } else {
        return '-' + cur;
      }
    });
  }, []);

  // Toggle DEG / RAD
  const handleToggleDeg = useCallback(() => {
    setIsDegMode((prev) => !prev);
  }, []);

  // Evaluate
  const handleEvaluate = useCallback(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
    const exprToEval = expression.trim();
    if (!exprToEval) return;

    try {
      const { formatted } = engine.evaluate(exprToEval);
      setPreviousExpr(`${exprToEval} =`);
      setExpression(formatted);
      setJustEvaluated(true);

      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        expression: exprToEval,
        result: formatted,
        timestamp: Date.now(),
        degMode: isDegMode,
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
    } catch (err: unknown) {
      sound.playErrorSound();
      const message = err instanceof Error ? err.message : 'Invalid calculation';
      setErrorMessage(message);
    }
  }, [expression, engine, isDegMode, errorMessage]);

  // Memory
  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      try {
        const { value } = engine.evaluate(expression);
        switch (action) {
          case 'MC':
            setMemoryValue(0);
            setHasMemory(false);
            break;
          case 'MR':
            if (hasMemory) {
              handleInsert(engine.formatNumber(memoryValue));
            }
            break;
          case 'MS':
            setMemoryValue(value);
            setHasMemory(true);
            break;
          case 'M+':
            setMemoryValue((prev) => prev + value);
            setHasMemory(true);
            break;
          case 'M-':
            setMemoryValue((prev) => prev - value);
            setHasMemory(true);
            break;
        }
      } catch {
        if (action === 'MC') {
          setMemoryValue(0);
          setHasMemory(false);
        } else if (action === 'MR' && hasMemory) {
          handleInsert(engine.formatNumber(memoryValue));
        }
      }
    },
    [engine, expression, hasMemory, memoryValue, handleInsert]
  );

  // History Selection
  const handleSelectHistory = useCallback(
    (item: HistoryItem, mode: 'insertResult' | 'editExpr') => {
      if (mode === 'insertResult') {
        handleInsert(item.result);
      } else {
        setExpression(item.expression);
        setPreviousExpr('');
        setJustEvaluated(false);
      }
      setMobileTab('calc');
    },
    [handleInsert]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Physical Desktop Keyboard Bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        sound.playDigitClick();
        handleInsert(key);
      } else if (key === '.') {
        e.preventDefault();
        sound.playDigitClick();
        handleInsert('.');
      } else if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) {
        e.preventDefault();
        sound.playOperatorClick();
        handleInsert(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        sound.playEqualSuccess();
        handleEvaluate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        sound.playOperatorClick();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        sound.playClearSound();
        handleClear();
      } else if (key === 's') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('sin(');
      } else if (key === 't') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('tan(');
      } else if (key === 'r' || key === 'q') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('sqrt(');
      } else if (key === 'l') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('log(');
      } else if (key === 'n') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('ln(');
      } else if (key === 'p') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('π');
      } else if (key === 'e') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('e');
      } else if (key === '!') {
        e.preventDefault();
        sound.playSciClick();
        handleInsert('!');
      } else if (key.toLowerCase() === 'd') {
        e.preventDefault();
        sound.playSciClick();
        handleToggleDeg();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleInsert,
    handleEvaluate,
    handleBackspace,
    handleClear,
    handleToggleDeg,
  ]);

  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    sound.setSoundEnabled(next);
    if (next) sound.playDigitClick();
  };

  return (
    <div className="min-h-screen bg-[#111319] text-[#ECF2F8] flex flex-col font-sans selection:bg-[#7EE081]/25">
      {/* Precision Top Bar */}
      <header className="h-13 sm:h-14 px-4 sm:px-8 flex items-center justify-between border-b border-[#272D3B]/70 bg-[#111319]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[5px] bg-[#1E2A38] border border-[#272D3B] flex items-center justify-center font-mono font-bold text-xs text-[#7EE081]">
            fx
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#ECF2F8]">
            Scientific Calculator
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Switch */}
          <button
            onClick={toggleSound}
            type="button"
            className="p-1.5 rounded-lg bg-[#181B24] border border-[#272D3B] text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E2A38] transition-colors cursor-pointer"
            title={isSoundOn ? 'Tactile Sound On' : 'Muted'}
            aria-label="Toggle Sound"
          >
            {isSoundOn ? (
              <Volume2 className="w-4 h-4 text-[#7EE081]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8A94A6]" />
            )}
          </button>

          {/* Keyboard Guide */}
          <button
            onClick={() => setShowShortcuts(true)}
            type="button"
            className="p-1.5 rounded-lg bg-[#181B24] border border-[#272D3B] text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E2A38] transition-colors cursor-pointer"
            title="Keyboard Shortcuts"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex items-center justify-around border-b border-[#272D3B] bg-[#14161F] px-2 py-1.5">
        <button
          type="button"
          onClick={() => {
            sound.playDigitClick();
            setMobileTab('calc');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mobileTab === 'calc'
              ? 'bg-[#1E2A38] text-[#7EE081] border border-[#7EE081]/30 shadow-xs'
              : 'text-[#8A94A6]'
          }`}
        >
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playDigitClick();
            setMobileTab('history');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mobileTab === 'history'
              ? 'bg-[#1E2A38] text-[#7EE081] border border-[#7EE081]/30 shadow-xs'
              : 'text-[#8A94A6]'
          }`}
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>History ({history.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playDigitClick();
            setMobileTab('constants');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mobileTab === 'constants'
              ? 'bg-[#1E2A38] text-[#7EE081] border border-[#7EE081]/30 shadow-xs'
              : 'text-[#8A94A6]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reference</span>
        </button>
      </div>

      {/* Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Authentic Scientific Calculator Hardware Enclosure */}
          <div
            className={`md:col-span-7 lg:col-span-7 flex flex-col ${
              mobileTab === 'calc' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Real Hardware Casing (Theme.PANEL = #181B24 with realistic depth) */}
            <div className="relative bg-[#181B24] border border-[#2A303E] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.14)] flex flex-col gap-3">
              {/* Molded Side Grip Ridges */}
              <div
                className="hidden sm:flex flex-col gap-1.5 absolute -left-[5px] top-24 bottom-24 justify-center pointer-events-none opacity-40"
                aria-hidden="true"
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-[#2A303E] rounded-r-xs" />
                ))}
              </div>
              <div
                className="hidden sm:flex flex-col gap-1.5 absolute -right-[5px] top-24 bottom-24 justify-center pointer-events-none opacity-40"
                aria-hidden="true"
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-[#2A303E] rounded-l-xs" />
                ))}
              </div>

              {/* Display Module (Branding + Photovoltaic Strip + Recessed Screen) */}
              <Display
                expression={expression}
                previousExpr={previousExpr}
                isDegMode={isDegMode}
                onToggleDeg={handleToggleDeg}
                hasMemory={hasMemory}
                memoryValue={memoryValue}
                errorMessage={errorMessage}
                justEvaluated={justEvaluated}
              />

              {/* Physical Keypad Socket Plate (Theme.BG = #111319) */}
              <div className="bg-[#111319] p-2 sm:p-2.5 rounded-[12px] border border-[#272D3B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)]">
                <Keypad
                  onInsert={handleInsert}
                  onClear={handleClear}
                  onBackspace={handleBackspace}
                  onEvaluate={handleEvaluate}
                  onNegate={handleNegate}
                  onToggleDeg={handleToggleDeg}
                  isDegMode={isDegMode}
                  onMemoryAction={handleMemoryAction}
                  hasMemory={hasMemory}
                />
              </div>
            </div>
          </div>

          {/* Right Companion Panel: Calculation History Tape & Reference */}
          <div
            className={`md:col-span-5 lg:col-span-5 flex-col h-[520px] sm:h-[590px] ${
              mobileTab !== 'calc' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Desktop Tabs Header */}
            <div className="hidden md:flex items-center gap-1.5 mb-2.5 bg-[#181B24] p-1 rounded-xl border border-[#272D3B]">
              <button
                type="button"
                onClick={() => {
                  sound.playDigitClick();
                  setDesktopTab('history');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  desktopTab === 'history'
                    ? 'bg-[#1E2A38] text-[#7EE081] shadow-xs border border-[#7EE081]/30'
                    : 'text-[#8A94A6] hover:text-[#ECF2F8]'
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>History ({history.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playDigitClick();
                  setDesktopTab('constants');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  desktopTab === 'constants'
                    ? 'bg-[#1E2A38] text-[#7EE081] shadow-xs border border-[#7EE081]/30'
                    : 'text-[#8A94A6] hover:text-[#ECF2F8]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Reference</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 h-full overflow-hidden">
              {(desktopTab === 'history' && mobileTab !== 'constants') ||
              mobileTab === 'history' ? (
                <HistoryPanel
                  history={history}
                  onSelectHistory={handleSelectHistory}
                  onClearHistory={handleClearHistory}
                  onDeleteItem={handleDeleteHistoryItem}
                />
              ) : (
                <ConstantsSheet
                  onInsertValue={(val) => {
                    handleInsert(val);
                    if (window.innerWidth < 768) {
                      setMobileTab('calc');
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
