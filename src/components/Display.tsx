import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { sound } from '../calculator/sound.ts';

interface DisplayProps {
  expression: string;
  previousExpr: string;
  isDegMode: boolean;
  onToggleDeg: () => void;
  hasMemory: boolean;
  memoryValue: number;
  errorMessage: string | null;
  justEvaluated: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  previousExpr,
  isDegMode,
  onToggleDeg,
  hasMemory,
  memoryValue,
  errorMessage,
  justEvaluated,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    sound.playDigitClick();
    const textToCopy = errorMessage ? '' : expression;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const formatErrorMessage = (msg: string | null): string => {
    if (!msg) return '';
    if (msg.includes('Divide by zero')) return 'Divide by zero';
    if (msg.includes('√ of negative')) return '√ of negative number';
    if (msg.includes('Mismatched brackets')) return 'Mismatched brackets';
    if (msg.includes('non-positive')) return 'Non-positive number';
    if (msg.includes('whole number')) return 'Integer required';
    return msg;
  };

  const textLength = expression.length;
  let textSizeClass = 'text-3xl sm:text-4xl lg:text-[42px]';
  if (textLength > 24) {
    textSizeClass = 'text-base sm:text-lg lg:text-xl';
  } else if (textLength > 16) {
    textSizeClass = 'text-xl sm:text-2xl lg:text-3xl';
  }

  return (
    <div className="flex flex-col gap-2 w-full select-none">
      {/* Top Metallic Bezel with Real Photovoltaic Solar Panel */}
      <div className="flex items-center justify-between px-2 pt-0.5 pb-1">
        {/* Brand Stamp */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-widest text-[#ECF2F8] font-mono">
              APEX
            </span>
            <span className="text-[9px] font-bold tracking-wider text-[#7EE081] uppercase font-mono">
              SCIENTIFIC
            </span>
          </div>
          <span className="text-[8px] tracking-widest text-[#8A94A6] font-mono uppercase">
            NATURAL DISPLAY · TWO WAY POWER
          </span>
        </div>

        {/* Photovoltaic Solar Panel Strip */}
        <div
          className="relative h-6 w-28 sm:w-36 rounded-[3px] bg-gradient-to-b from-[#111624] via-[#1a2236] to-[#0d121d] border border-[#2A303E] p-[1.5px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.08)] flex items-center overflow-hidden"
          title="Solar / Dual Power Cell"
        >
          <div className="grid grid-cols-4 w-full h-full gap-[1.5px]">
            <div className="bg-gradient-to-br from-[#1E2738] to-[#121824] border-r border-[#2d3a52]/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
            </div>
            <div className="bg-gradient-to-br from-[#1E2738] to-[#121824] border-r border-[#2d3a52]/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
            </div>
            <div className="bg-gradient-to-br from-[#1E2738] to-[#121824] border-r border-[#2d3a52]/80 border-l border-[#0a0e17] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
            </div>
            <div className="bg-gradient-to-br from-[#1E2738] to-[#121824] border-l border-[#0a0e17] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/[0.04] to-amber-500/[0.04]" />
        </div>
      </div>

      {/* Recessed Display Window (Theme.DISPLAY = #0A0C11) */}
      <div className="relative rounded-lg bg-[#0A0C11] border-2 border-[#2A303E] shadow-[inset_0_4px_16px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)] p-3 sm:p-4 min-h-[120px] sm:min-h-[142px] flex flex-col justify-between overflow-hidden">
        {/* Anti-Reflective Optical Glass Sheen */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Top Annunciator Line */}
        <div className="relative z-10 flex items-center justify-between pb-1 border-b border-[#1E2A38]/50 text-[10px] font-mono select-none">
          <div className="flex items-center gap-2">
            {/* DEG / RAD Button (Theme.ACCENT = #7EE081) */}
            <button
              onClick={() => {
                sound.playSciClick();
                onToggleDeg();
              }}
              type="button"
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#181B24] hover:bg-[#1E2A38] border border-[#272D3B] cursor-pointer transition-colors"
              title="Click to toggle Degree / Radian"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDegMode
                    ? 'bg-[#7EE081] shadow-[0_0_5px_#7EE081]'
                    : 'bg-[#F59E0B] shadow-[0_0_5px_#F59E0B]'
                }`}
              />
              <span className="font-mono text-[10px] font-bold text-[#ECF2F8]">
                {isDegMode ? 'DEG' : 'RAD'}
              </span>
            </button>

            {/* Memory annunciator */}
            {hasMemory && (
              <span
                className="px-1.5 py-0.5 rounded-[3px] bg-[#181B24] border border-[#F59E0B]/30 text-[#F59E0B] font-mono text-[9px] font-bold"
                title={`Memory: ${memoryValue}`}
              >
                M ({memoryValue})
              </span>
            )}
          </div>

          {/* Right side: Previous expression & Copy button */}
          <div className="flex items-center gap-2 max-w-[65%] overflow-hidden justify-end">
            <span
              className="text-xs sm:text-sm font-mono text-[#8A94A6] truncate select-all"
              title={previousExpr}
            >
              {previousExpr || ''}
            </span>

            <button
              onClick={handleCopy}
              type="button"
              title="Copy value"
              aria-label="Copy to clipboard"
              className="p-1 rounded text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#181B24] transition-colors cursor-pointer shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="text-[#2EC4B6] flex items-center gap-1 text-[10px] font-mono font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copied</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Main Digital Readout */}
        <div className="relative z-10 mt-2 flex items-baseline justify-end w-full overflow-x-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {errorMessage ? (
              <motion.div
                key="err"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: [-4, 4, -2, 2, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-mono font-semibold text-[#E04F4F] text-base sm:text-xl tracking-tight select-text py-1"
              >
                {formatErrorMessage(errorMessage)}
              </motion.div>
            ) : (
              <motion.div
                key={justEvaluated ? 'eval' : 'type'}
                initial={justEvaluated ? { opacity: 0.85 } : false}
                animate={{ opacity: 1 }}
                className={`font-mono font-bold tracking-tight text-right text-[#ECF2F8] tabular-nums whitespace-nowrap select-text ${textSizeClass}`}
                style={{
                  textShadow: '0 0 1px rgba(236,242,248,0.4)',
                }}
              >
                {expression || '0'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
