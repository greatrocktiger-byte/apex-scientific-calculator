# 🔬 Apex Scientific Calculator

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite)](https://vitejs.dev/)

An authentic, tactile, and precision scientific calculator engineered with a custom pure-TypeScript Shunting-Yard expression engine, realistic dual-power photovoltaic styling, physical rubber-dome switch acoustics, and a continuous calculation tape.

---

## ✨ Features

- **🎛️ Dual-Power Hardware Aesthetic:**
  - Styled after professional engineering calculators (Casio fx-series / TI-84).
  - Recessed high-contrast optical glass screen with annunciator indicators (`DEG`/`RAD`, Memory indicator `M`).
  - Molded side-grip ridges, 3D tactile keycaps with micro-press physics.
  - Photovoltaic solar cell simulation strip.

- **⚡ Shunting-Yard Math Engine:**
  - Custom tokenizing and Reverse Polish Notation (RPN) evaluation with exact mathematical precedence.
  - Proper handling of unary minus negation vs subtraction (`-5^2`, `(-2)^3`).
  - Trigonometric & hyperbolic math: `sin`, `cos`, `tan`, `asin`, `acos`, `atan` in both Degrees and Radians.
  - Power & root expressions: `x²`, `x³`, `xʸ`, `√x`, `∛x`, `10ˣ`, `eˣ`.
  - Logarithms and factorials: `log₁₀`, `ln`, `n!`, `%` percent calculation.
  - Graceful math domain error guards (divide by zero, negative square roots, non-integer factorials).

- **🔊 Physical Switch Acoustics & Haptics:**
  - Web Audio API real-time acoustic synthesis modeling rubber-dome switch travel (`thock`, plastic bandpass resonance, bottom-out decay).
  - Web Vibration API micro-haptics for mobile devices.
  - Toggleable tactile audio switch.

- **📜 Continuous Calculation Tape & Memory:**
  - Real-time history paper tape persisted in local storage (`localStorage`).
  - 1-click result insertion, expression recall, and clipboard copying.
  - Standard memory registers (`MC`, `MR`, `M+`, `M-`, `MS`).

- **📚 Scientific Reference Library:**
  - One-tap insertion of physical and mathematical constants ($\pi$, $e$, $\phi$, $c$, $h$, $G$, $k_B$, $N_A$).
  - Quick-start formula templates (Pythagorean theorem, sphere volume, Euler's identity, compound interest).

- **⌨️ Physical Keyboard Support:**
  - Direct keyboard mapping for numbers, operators, Enter/Equal, Backspace, Escape/Clear.
  - Quick scientific function keys (`s` for sin, `t` for tan, `r`/`q` for sqrt, `l` for log, `n` for ln, `p` for $\pi$, `e` for $e$, `d` for DEG/RAD).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/greatrocktiger-byte/apex-scientific-calculator.git
cd apex-scientific-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Architecture

```
src/
├── calculator/
│   ├── constants.ts     # Physical and mathematical constants & formula templates
│   ├── engine.ts        # Pure TypeScript Shunting-Yard tokenizer & RPN evaluator
│   ├── sound.ts         # Web Audio API synthetic switch acoustics & haptic driver
│   └── types.ts         # TypeScript definitions for items, formulas, and history
├── components/
│   ├── ConstantsSheet.tsx           # Scientific reference & constant insertion panel
│   ├── Display.tsx                  # Natural display module with solar bezel & annunciators
│   ├── HistoryPanel.tsx             # Paper tape calculation history list
│   ├── KeyboardShortcutsModal.tsx   # Interactive keyboard shortcut guide
│   └── Keypad.tsx                   # 3D keycaps grid with 2nd mode & memory buttons
├── App.tsx              # Main orchestrator, responsive layout & hotkey listener
├── index.css            # Tailwind CSS v4 styling & typography
└── main.tsx             # React DOM root entry
```

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.
