export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  degMode: boolean;
}

export interface ConstantItem {
  symbol: string;
  displaySymbol: string;
  name: string;
  value: string;
  numericValue: number;
  unit?: string;
  description: string;
  category: 'Mathematical' | 'Physical';
}

export interface FormulaItem {
  title: string;
  formula: string;
  expressionToInsert: string;
  description: string;
  category: string;
}

export type KeyCategory = 'digit' | 'sci' | 'op' | 'clear' | 'eq' | 'fn';

export interface KeyButtonDef {
  id: string;
  label: string;
  subLabel?: string;
  category: KeyCategory;
  colSpan?: number;
  rowSpan?: number;
  ariaLabel: string;
  kbdShortcut?: string;
  action: () => void;
}
