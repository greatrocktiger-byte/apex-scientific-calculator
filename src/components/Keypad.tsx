import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';
import { sound } from '../calculator/sound.ts';

interface KeypadProps {
  onInsert: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEvaluate: () => void;
  onNegate: () => void;
  onToggleDeg: () => void;
  isDegMode: boolean;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  hasMemory: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInsert,
  onClear,
  onBackspace,
  onEvaluate,
  onNegate,
  onToggleDeg,
  isDegMode,
  onMemoryAction,
  hasMemory,
}) => {
  const [secondMode, setSecondMode] = useState(false);

  const handleKeyClick = (
    action: () => void,
    type: 'num' | 'op' | 'fn' | 'eq' | 'clear'
  ) => {
    sound.playKeyClick(type);
    action();
  };

  return (
    <div className="flex flex-col gap-2 w-full select-none">
      {/* Top Memory & 2nd Rail */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => {
            sound.playKeyClick('fn');
            setSecondMode(!secondMode);
          }}
          className={`h-8 sm:h-9 rounded-[6px] text-xs font-mono font-bold transition-all cursor-pointer border-t ${
            secondMode
              ? 'bg-[#7EE081] text-[#0A0C11] border-emerald-200/50 shadow-[0_2.5px_0_#4BAE51,0_4px_8px_rgba(126,224,129,0.35)]'
              : 'bg-[#181B24] text-[#8A94A6] border-white/[0.08] shadow-[0_2.5px_0_#0F121A] hover:bg-[#1E222D] hover:text-[#ECF2F8]'
          }`}
          title="Toggle 2nd Functions"
        >
          2nd
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => handleKeyClick(() => onMemoryAction('MC'), 'fn')}
          disabled={!hasMemory}
          className={`h-8 sm:h-9 rounded-[6px] text-xs font-mono font-medium transition-all border-t ${
            hasMemory
              ? 'bg-[#181B24] text-[#ECF2F8] border-white/[0.08] shadow-[0_2.5px_0_#0F121A] hover:bg-[#1E222D] cursor-pointer'
              : 'bg-[#12151D] text-[#475569] border-transparent shadow-none cursor-not-allowed opacity-40'
          }`}
          title="Memory Clear"
        >
          MC
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => handleKeyClick(() => onMemoryAction('MR'), 'fn')}
          disabled={!hasMemory}
          className={`h-8 sm:h-9 rounded-[6px] text-xs font-mono font-medium transition-all border-t ${
            hasMemory
              ? 'bg-[#181B24] text-[#ECF2F8] border-white/[0.08] shadow-[0_2.5px_0_#0F121A] hover:bg-[#1E222D] cursor-pointer'
              : 'bg-[#12151D] text-[#475569] border-transparent shadow-none cursor-not-allowed opacity-40'
          }`}
          title="Memory Recall"
        >
          MR
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => handleKeyClick(() => onMemoryAction('M+'), 'fn')}
          className="h-8 sm:h-9 rounded-[6px] text-xs font-mono font-medium bg-[#181B24] text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E222D] transition-all border-t border-white/[0.08] shadow-[0_2.5px_0_#0F121A] cursor-pointer"
          title="Memory Add"
        >
          M+
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => handleKeyClick(() => onMemoryAction('M-'), 'fn')}
          className="h-8 sm:h-9 rounded-[6px] text-xs font-mono font-medium bg-[#181B24] text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E222D] transition-all border-t border-white/[0.08] shadow-[0_2.5px_0_#0F121A] cursor-pointer"
          title="Memory Subtract"
        >
          M-
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          type="button"
          onClick={() => handleKeyClick(() => onMemoryAction('MS'), 'fn')}
          className="h-8 sm:h-9 rounded-[6px] text-xs font-mono font-medium bg-[#181B24] text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E222D] transition-all border-t border-white/[0.08] shadow-[0_2.5px_0_#0F121A] cursor-pointer"
          title="Memory Store"
        >
          MS
        </motion.button>
      </div>

      {/* Main Keypad Grid (Exact Theme.java Colors & CalcUI layout with Realistic 3D Keycaps) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5 pt-1">
        {/* ROW 0: sin, cos, tan, √, x², ⌫ */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => onInsert(secondMode ? 'asin(' : 'sin('),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? 'asin' : 'sin'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => onInsert(secondMode ? 'acos(' : 'cos('),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? 'acos' : 'cos'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => onInsert(secondMode ? 'atan(' : 'tan('),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? 'atan' : 'tan'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => onInsert(secondMode ? 'cbrt(' : 'sqrt('),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-sm sm:text-base font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? '∛' : '√'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('^2'), 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          x²
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(onBackspace, 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2C3342] to-[#222835] text-[#ECF2F8] border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer transition-colors hover:brightness-110"
          title="Backspace"
        >
          <Delete className="w-4 h-4 text-[#8A94A6] hover:text-[#ECF2F8]" />
        </motion.button>

        {/* ROW 1: log, ln, xʸ, n!, π, e */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => (secondMode ? onInsert('10^') : onInsert('log(')),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? '10ˣ' : 'log'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() =>
            handleKeyClick(
              () => (secondMode ? onInsert('e^') : onInsert('ln(')),
              'fn'
            )
          }
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {secondMode ? 'eˣ' : 'ln'}
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('^'), 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          xʸ
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('!'), 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          n!
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('π'), 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-sm sm:text-base font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          π
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('e'), 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-sm sm:text-base font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          e
        </motion.button>

        {/* ROW 2: 7, 8, 9, ÷, DEG, C */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('7'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          7
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('8'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          8
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('9'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          9
        </motion.button>

        {/* Division ÷ (Theme.BTN_OP = #F59E0B) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('/'), 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-[#111319] font-mono text-xl sm:text-2xl font-black flex items-center justify-center border-t border-amber-200/40 shadow-[0_3px_0_#8D4D05,0_4px_8px_rgba(245,158,11,0.3)] hover:brightness-105 cursor-pointer transition-colors"
        >
          ÷
        </motion.button>

        {/* DEG / RAD Button */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(onToggleDeg, 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-xs sm:text-sm font-bold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          {isDegMode ? 'DEG' : 'RAD'}
        </motion.button>

        {/* Clear C (Theme.BTN_CLEAR = #E04F4F) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(onClear, 'clear')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#E04F4F] to-[#C93B3B] text-white font-mono text-sm sm:text-base font-bold flex items-center justify-center border-t border-red-300/40 shadow-[0_3px_0_#831F1F,0_4px_8px_rgba(224,79,79,0.35)] hover:brightness-105 cursor-pointer transition-colors"
          title="Clear"
        >
          C
        </motion.button>

        {/* ROW 3: 4, 5, 6, ×, ±, ( */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('4'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          4
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('5'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          5
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('6'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          6
        </motion.button>

        {/* Multiplication × (Theme.BTN_OP = #F59E0B) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('*'), 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-[#111319] font-mono text-xl sm:text-2xl font-black flex items-center justify-center border-t border-amber-200/40 shadow-[0_3px_0_#8D4D05,0_4px_8px_rgba(245,158,11,0.3)] hover:brightness-105 cursor-pointer transition-colors"
        >
          ×
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(onNegate, 'fn')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#222F3E] to-[#1A2532] text-[#7EE081] font-mono text-sm sm:text-base font-semibold flex items-center justify-center border-t border-white/[0.12] shadow-[0_3px_0_#101620,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          ±
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('('), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-base font-medium flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          (
        </motion.button>

        {/* ROW 4: 1, 2, 3, −, %, ) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('1'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          1
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('2'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          2
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('3'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          3
        </motion.button>

        {/* Subtraction − (Theme.BTN_OP = #F59E0B) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('-'), 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-[#111319] font-mono text-xl sm:text-2xl font-black flex items-center justify-center border-t border-amber-200/40 shadow-[0_3px_0_#8D4D05,0_4px_8px_rgba(245,158,11,0.3)] hover:brightness-105 cursor-pointer transition-colors"
        >
          −
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('%'), 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-sm sm:text-base font-medium flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          %
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert(')'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-base font-medium flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          )
        </motion.button>

        {/* ROW 5: 0, ., 00, +, = (spans 2 cols) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('0'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          0
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('.'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-lg sm:text-xl font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          .
        </motion.button>

        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('00'), 'num')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2D3444] to-[#232936] text-[#ECF2F8] font-mono text-xs sm:text-sm font-bold flex items-center justify-center border-t border-white/[0.14] shadow-[0_3px_0_#141720,0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-colors"
        >
          00
        </motion.button>

        {/* Addition + (Theme.BTN_OP = #F59E0B) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(() => onInsert('+'), 'op')}
          type="button"
          className="h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-[#111319] font-mono text-xl sm:text-2xl font-black flex items-center justify-center border-t border-amber-200/40 shadow-[0_3px_0_#8D4D05,0_4px_8px_rgba(245,158,11,0.3)] hover:brightness-105 cursor-pointer transition-colors"
        >
          +
        </motion.button>

        {/* Equals = (Theme.BTN_EQ = #2EC4B6, spans 2 columns) */}
        <motion.button
          whileTap={{ y: 2 }}
          onClick={() => handleKeyClick(onEvaluate, 'eq')}
          type="button"
          className="col-span-2 h-11 sm:h-12.5 rounded-[6px] bg-gradient-to-b from-[#2EC4B6] to-[#1FA89B] text-[#0A0C11] font-mono text-xl sm:text-2xl font-black flex items-center justify-center border-t border-teal-200/50 shadow-[0_3px_0_#13746B,0_5px_10px_rgba(46,196,182,0.35)] hover:brightness-105 cursor-pointer transition-colors"
          title="Calculate"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};
