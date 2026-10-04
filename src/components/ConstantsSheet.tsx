import React, { useState } from 'react';
import { SCIENTIFIC_CONSTANTS, FORMULA_TEMPLATES } from '../calculator/constants.ts';
import { ConstantItem, FormulaItem } from '../calculator/types.ts';
import { sound } from '../calculator/sound.ts';
import { PlusCircle } from 'lucide-react';

interface ConstantsSheetProps {
  onInsertValue: (val: string) => void;
}

export const ConstantsSheet: React.FC<ConstantsSheetProps> = ({ onInsertValue }) => {
  const [activeTab, setActiveTab] = useState<'constants' | 'formulas'>('constants');

  const handleInsert = (val: string) => {
    sound.playSciClick();
    onInsertValue(val);
  };

  return (
    <div className="flex flex-col h-full bg-[#181B24] rounded-[18px] border border-[#272D3B] p-4 overflow-hidden shadow-xl">
      {/* Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-[#272D3B]">
        <div className="flex items-center gap-1 bg-[#111319] p-1 rounded-lg border border-[#272D3B] w-full">
          <button
            type="button"
            onClick={() => {
              sound.playDigitClick();
              setActiveTab('constants');
            }}
            className={`flex-1 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'constants'
                ? 'bg-[#1E2A38] text-[#7EE081] border border-[#7EE081]/30 shadow-xs'
                : 'text-[#8A94A6] hover:text-[#ECF2F8]'
            }`}
          >
            Constants
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playDigitClick();
              setActiveTab('formulas');
            }}
            className={`flex-1 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-[#1E2A38] text-[#7EE081] border border-[#7EE081]/30 shadow-xs'
                : 'text-[#8A94A6] hover:text-[#ECF2F8]'
            }`}
          >
            Formulas
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-1.5 no-scrollbar">
        {activeTab === 'constants' ? (
          SCIENTIFIC_CONSTANTS.map((c: ConstantItem) => (
            <div
              key={c.name}
              onClick={() => handleInsert(c.symbol)}
              className="group p-2.5 rounded-lg bg-[#111319] hover:bg-[#141720] border border-[#272D3B] hover:border-[#7EE081]/40 cursor-pointer transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-[#1E2A38] border border-[#2A3B4D] flex items-center justify-center font-mono font-bold text-xs text-[#7EE081] shrink-0">
                  {c.displaySymbol}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-[#ECF2F8] truncate font-mono">
                    {c.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#8A94A6] truncate">
                    {c.value} {c.unit ? `[${c.unit}]` : ''}
                  </div>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-2 text-[#7EE081]">
                <PlusCircle className="w-4 h-4" />
              </div>
            </div>
          ))
        ) : (
          FORMULA_TEMPLATES.map((f: FormulaItem) => (
            <div
              key={f.title}
              onClick={() => handleInsert(f.expressionToInsert)}
              className="group p-2.5 rounded-lg bg-[#111319] hover:bg-[#141720] border border-[#272D3B] hover:border-[#7EE081]/40 cursor-pointer transition-all flex flex-col gap-1 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#ECF2F8] font-mono">{f.title}</span>
                <span className="text-[10px] font-mono text-[#2EC4B6]">Insert</span>
              </div>
              <div className="font-mono text-xs text-[#2EC4B6]">{f.formula}</div>
              <div className="text-[11px] text-[#8A94A6]">{f.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
