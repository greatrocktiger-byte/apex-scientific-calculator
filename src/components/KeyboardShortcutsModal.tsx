import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9, .', action: 'Numbers & decimal point' },
    { key: '+ - * / %', action: 'Arithmetic operations' },
    { key: '^', action: 'Exponent power (xʸ)' },
    { key: '(', action: 'Open bracket' },
    { key: ')', action: 'Close bracket' },
    { key: 'Enter / =', action: 'Calculate result' },
    { key: 'Backspace', action: 'Delete character' },
    { key: 'Escape / C', action: 'Clear (C)' },
    { key: 's / c / t', action: 'Trigonometry: sin( / cos( / tan(' },
    { key: 'r', action: 'Square root sqrt(' },
    { key: 'l / n', action: 'Logarithm: log( / ln(' },
    { key: 'p / e', action: 'Constants: π / e' },
    { key: '!', action: 'Factorial (n!)' },
    { key: 'd', action: 'Toggle DEG / RAD angle mode' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md bg-[#181B24] border border-[#272D3B] rounded-[16px] shadow-2xl p-5 overflow-hidden text-[#ECF2F8]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#272D3B]">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-[#7EE081]" />
              <h3 className="font-semibold text-sm tracking-wide">Physical Keyboard Guide</h3>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E2A38] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 max-h-[60vh] overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between py-1.5 px-2.5 rounded bg-[#111319] border border-[#272D3B] text-xs font-mono"
              >
                <kbd className="px-2 py-0.5 bg-[#1E2A38] text-[#7EE081] rounded border border-[#2A3B4D] font-bold text-[11px]">
                  {s.key}
                </kbd>
                <span className="text-[#8A94A6] text-right">{s.action}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#272D3B] flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-[#2EC4B6] hover:bg-[#25ab9e] text-[#0A0C11] font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
