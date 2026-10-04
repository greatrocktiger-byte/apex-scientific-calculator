import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, CornerDownLeft, Copy, Clock } from 'lucide-react';
import { HistoryItem } from '../calculator/types.ts';
import { sound } from '../calculator/sound.ts';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem, mode: 'insertResult' | 'editExpr') => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteItem,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyResult = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playDigitClick();
    try {
      await navigator.clipboard.writeText(item.result);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {}
  };

  return (
    <div className="flex flex-col h-full bg-[#181B24] rounded-[18px] border border-[#272D3B] p-4 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#272D3B]">
        <div className="flex items-center gap-2 text-[#ECF2F8]">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#8A94A6] font-mono">
            Calculation Tape
          </h2>
          {history.length > 0 && (
            <span className="text-[10px] font-mono text-[#7EE081] bg-[#111319] px-2 py-0.5 rounded border border-[#7EE081]/20">
              {history.length}
            </span>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              sound.playClearSound();
              onClearHistory();
            }}
            type="button"
            className="flex items-center gap-1 text-xs text-[#E04F4F] hover:text-red-400 hover:bg-[#E04F4F]/10 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Clear paper tape"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History Items */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2 no-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#8A94A6] px-4">
            <Clock className="w-7 h-7 stroke-1 text-[#3E4656] mb-2" />
            <p className="text-xs font-mono text-[#ECF2F8]/70">Tape empty</p>
            <p className="text-[11px] text-[#8A94A6] mt-1">
              Evaluated calculations will appear here.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  sound.playDigitClick();
                  onSelectHistory(item, 'insertResult');
                }}
                className="group relative bg-[#111319] hover:bg-[#141720] border border-[#272D3B] hover:border-[#7EE081]/40 rounded-lg p-2.5 cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-[#8A94A6] mb-1 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-[#7EE081]/80">
                      {item.degMode ? 'DEG' : 'RAD'}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopyResult(item, e)}
                      type="button"
                      className="p-1 rounded text-[#8A94A6] hover:text-[#ECF2F8] hover:bg-[#1E2A38] transition-colors"
                      title="Copy result"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playDigitClick();
                        onDeleteItem(item.id);
                      }}
                      type="button"
                      className="p-1 rounded text-[#8A94A6] hover:text-[#E04F4F] hover:bg-[#E04F4F]/10 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-[#8A94A6] truncate">
                  {item.expression} =
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="font-mono font-bold text-base text-[#7EE081] tracking-tight tabular-nums">
                    {item.result}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#8A94A6] group-hover:text-[#2EC4B6] transition-colors">
                    <CornerDownLeft className="w-3 h-3" />
                    <span>Insert</span>
                  </div>
                </div>

                {copiedId === item.id && (
                  <span className="absolute top-2 right-12 text-[9px] font-mono text-[#2EC4B6] bg-[#0A0C11] px-1.5 py-0.5 rounded border border-[#2EC4B6]/30">
                    Copied
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
