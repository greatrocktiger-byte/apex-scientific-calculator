/**
 * Pure TypeScript Shunting-Yard Scientific Expression Engine.
 * Evaluates math expressions with exact precedence, unary minus handling,
 * trigonometric/transcendental functions, constants, and robust error exceptions.
 */

export interface EvaluationResult {
  value: number;
  formatted: string;
}

export class CalculatorEngine {
  private degMode: boolean = true;

  constructor(degMode: boolean = true) {
    this.degMode = degMode;
  }

  public setDegMode(deg: boolean): void {
    this.degMode = deg;
  }

  public isDegMode(): boolean {
    return this.degMode;
  }

  public evaluate(expr: string): EvaluationResult {
    if (!expr || expr.trim() === '') {
      return { value: 0, formatted: '0' };
    }

    const tokens = this.tokenize(expr);
    const rpn = this.toRPN(tokens);
    const value = this.evalRPN(rpn);
    const formatted = this.formatNumber(value);

    return { value, formatted };
  }

  // ---------------- Tokenizer ----------------
  public tokenize(s: string): string[] {
    const raw: string[] = [];
    let i = 0;
    const n = s.length;

    while (i < n) {
      const c = s.charAt(i);

      if (c === ' ') {
        i++;
        continue;
      }

      // Numbers (integers and decimals)
      if (this.isDigit(c) || c === '.') {
        let num = '';
        while (i < n && (this.isDigit(s.charAt(i)) || s.charAt(i) === '.')) {
          num += s.charAt(i++);
        }
        raw.push(num);
      }
      // Word functions and constants
      else if (this.isLetter(c)) {
        let word = '';
        while (i < n && this.isLetter(s.charAt(i))) {
          word += s.charAt(i++);
        }
        const lower = word.toLowerCase();
        if (lower === 'pi') {
          raw.push('π');
        } else {
          raw.push(lower);
        }
      }
      // Special single characters
      else if (c === 'π' || c === 'e' || c === '!') {
        raw.push(c);
        i++;
      }
      // Operator glyphs (handling common unicode symbols)
      else if (c === '×' || c === '·') {
        raw.push('*');
        i++;
      } else if (c === '÷') {
        raw.push('/');
        i++;
      } else if (c === '−' || c === '–') {
        raw.push('-');
        i++;
      } else if (c === '√') {
        raw.push('sqrt');
        i++;
      } else {
        raw.push(c);
        i++;
      }
    }

    // Unary minus -> special "neg" token (start, after operator, or after '(')
    const out: string[] = [];
    for (let j = 0; j < raw.length; j++) {
      let t = raw[j];
      if (t === '-') {
        const isUnary =
          j === 0 ||
          this.isOperator(raw[j - 1]) ||
          raw[j - 1] === '(' ||
          this.isFunction(raw[j - 1]);
        if (isUnary) {
          t = 'neg';
        }
      }
      out.push(t);
    }

    return out;
  }

  // ---------------- Shunting-yard Algorithm ----------------
  public toRPN(tokens: string[]): string[] {
    const out: string[] = [];
    const stack: string[] = [];

    for (const t of tokens) {
      if (this.isNumber(t) || this.isConstant(t)) {
        out.push(t);
      } else if (t === 'neg') {
        // Unary minus: prefix operator, push to stack awaiting following operand
        stack.push(t);
      } else if (this.isFunction(t)) {
        stack.push(t);
      } else if (t === '!') {
        // Postfix operator -> straight to output
        out.push(t);
      } else if (this.isOperator(t)) {
        while (
          stack.length > 0 &&
          this.isOperator(stack[stack.length - 1])
        ) {
          const top = stack[stack.length - 1];
          let pop = false;
          if (t === '^') {
            // ^ is right-associative
            pop = this.prec(t) < this.prec(top);
          } else {
            pop = this.prec(t) <= this.prec(top);
          }
          if (!pop) break;
          out.push(stack.pop()!);
        }
        stack.push(t);
      } else if (t === '(') {
        stack.push(t);
      } else if (t === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          out.push(stack.pop()!);
        }
        if (stack.length === 0) {
          throw new Error('Mismatched brackets');
        }
        stack.pop(); // drop '('
        if (stack.length > 0 && this.isFunction(stack[stack.length - 1])) {
          out.push(stack.pop()!);
        }
      } else {
        throw new Error(`Unknown token: ${t}`);
      }
    }

    while (stack.length > 0) {
      const t = stack.pop()!;
      if (t === '(' || t === ')') {
        throw new Error('Mismatched brackets');
      }
      out.push(t);
    }

    return out;
  }

  // ---------------- RPN Evaluation ----------------
  public evalRPN(rpn: string[]): number {
    const st: number[] = [];

    for (const t of rpn) {
      if (this.isNumber(t)) {
        const parsed = Number(t);
        if (isNaN(parsed)) throw new Error(`Invalid number: ${t}`);
        st.push(parsed);
      } else if (this.isConstant(t)) {
        st.push(t === 'π' ? Math.PI : Math.E);
      } else if (t === 'neg') {
        if (st.length === 0) throw new Error('Invalid expression');
        st.push(-st.pop()!);
      } else if (this.isOperator(t)) {
        if (st.length < 2) throw new Error('Invalid expression');
        const b = st.pop()!;
        const a = st.pop()!;

        switch (t) {
          case '+':
            st.push(a + b);
            break;
          case '-':
            st.push(a - b);
            break;
          case '*':
            st.push(a * b);
            break;
          case '/':
            if (b === 0) throw new Error('Divide by zero');
            st.push(a / b);
            break;
          case '%':
            if (b === 0) throw new Error('Divide by zero');
            st.push(a % b);
            break;
          case '^':
            // Check for negative base with non-integer exponent
            if (a < 0 && Math.floor(b) !== b) {
              throw new Error('Negative base with non-integer power');
            }
            st.push(Math.pow(a, b));
            break;
          default:
            throw new Error(`Unknown operator ${t}`);
        }
      } else if (this.isFunction(t)) {
        if (st.length === 0) throw new Error('Invalid expression');
        const x = st.pop()!;
        let r: number;

        switch (t) {
          case 'sin':
            r = Math.sin(this.angleToRad(x));
            break;
          case 'cos':
            r = Math.cos(this.angleToRad(x));
            break;
          case 'tan': {
            const rad = this.angleToRad(x);
            // In deg mode, 90 + 180k has undefined tan
            if (this.degMode && Math.abs(x % 180) === 90) {
              throw new Error('tan is undefined at 90°');
            }
            r = Math.tan(rad);
            break;
          }
          case 'asin':
            if (x < -1 || x > 1) throw new Error('asin argument must be in [-1, 1]');
            r = this.radToAngle(Math.asin(x));
            break;
          case 'acos':
            if (x < -1 || x > 1) throw new Error('acos argument must be in [-1, 1]');
            r = this.radToAngle(Math.acos(x));
            break;
          case 'atan':
            r = this.radToAngle(Math.atan(x));
            break;
          case 'sqrt':
            if (x < 0) throw new Error('√ of negative number');
            r = Math.sqrt(x);
            break;
          case 'cbrt':
            r = Math.cbrt(x);
            break;
          case 'log':
            if (x <= 0) throw new Error('log of non-positive number');
            r = Math.log10(x);
            break;
          case 'ln':
            if (x <= 0) throw new Error('ln of non-positive number');
            r = Math.log(x);
            break;
          case 'abs':
            r = Math.abs(x);
            break;
          default:
            throw new Error(`Unknown function: ${t}`);
        }

        st.push(this.cleanFloat(r));
      } else if (t === '!') {
        if (st.length === 0) throw new Error('Invalid expression');
        st.push(this.factorial(st.pop()!));
      }
    }

    if (st.length !== 1) {
      throw new Error('Invalid expression');
    }

    return this.cleanFloat(st.pop()!);
  }

  // ---------------- Helpers ----------------
  private angleToRad(x: number): number {
    return this.degMode ? (x * Math.PI) / 180 : x;
  }

  private radToAngle(rad: number): number {
    return this.degMode ? (rad * 180) / Math.PI : rad;
  }

  private factorial(x: number): number {
    if (x < 0 || Math.floor(x) !== x) {
      throw new Error('n! needs a non-negative whole number');
    }
    if (x > 170) {
      throw new Error('n! result too large');
    }
    let r = 1;
    for (let i = 2; i <= x; i++) {
      r *= i;
    }
    return r;
  }

  private cleanFloat(x: number): number {
    if (isNaN(x) || !isFinite(x)) {
      throw new Error('Math error');
    }
    // Snap close floating values like sin(30) = 0.49999999999999994 -> 0.5
    // and cos(90) = 6.12e-17 -> 0
    if (Math.abs(x) < 1e-12) return 0;
    const rounded = Math.round(x * 1e12) / 1e12;
    return rounded;
  }

  public formatNumber(v: number): string {
    if (!isFinite(v) || isNaN(v)) {
      return 'Error';
    }
    // Clean rounding for standard integers and decimals
    const rounded = Math.round(v * 1e10) / 1e10;
    if (rounded === Math.floor(rounded) && Math.abs(rounded) < 1e15) {
      return rounded.toString();
    }
    // Very large or very tiny numbers use clean scientific format
    if (Math.abs(v) >= 1e15 || (Math.abs(v) < 1e-7 && v !== 0)) {
      return v.toExponential(8).replace(/\.?0+e/, 'e');
    }
    // Format up to 10 significant digits without trailing zeroes
    const str = rounded.toFixed(10);
    return str.replace(/\.?0+$/, '');
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isLetter(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  }

  private isNumber(t: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(t) || /^\.[0-9]+$/.test(t);
  }

  private isConstant(t: string): boolean {
    return t === 'π' || t === 'e';
  }

  private isFunction(t: string): boolean {
    return (
      t === 'sin' ||
      t === 'cos' ||
      t === 'tan' ||
      t === 'asin' ||
      t === 'acos' ||
      t === 'atan' ||
      t === 'sqrt' ||
      t === 'cbrt' ||
      t === 'log' ||
      t === 'ln' ||
      t === 'abs'
    );
  }

  private isOperator(t: string): boolean {
    return (
      t === '+' ||
      t === '-' ||
      t === '*' ||
      t === '/' ||
      t === '%' ||
      t === '^' ||
      t === 'neg'
    );
  }

  private prec(op: string): number {
    switch (op) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
      case '%':
        return 2;
      case 'neg':
        return 3;
      case '^':
        return 4;
      default:
        return -1;
    }
  }
}
