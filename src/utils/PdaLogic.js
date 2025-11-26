// src/utils/PdaLogic.js

// Helper: Menentukan prioritas operator
const getPrecedence = (op) => {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
};

const isOperator = (token) => ["+", "-", "*", "/"].includes(token);

// 1. Tokenizer: Mengubah string "10+20" menjadi array ["10", "+", "20"]
// Ini penting agar PDA tidak bingung antara digit "1" dan angka "10"
const tokenize = (expr) => {
  const regex = /([+\-*/()^])|\s+/g;
  // Split, filter spasi kosong, dan return
  return expr
    .split(regex)
    .map((s) => (s ? s.trim() : ""))
    .filter((s) => s.length > 0);
};

// 2. Core PDA Logic: Infix to Postfix (Shunting Yard Algorithm)
const infixToPostfix = (tokens) => {
  let stack = [];
  let output = [];

  tokens.forEach((token) => {
    if (!isNaN(token)) {
      output.push(token); // Operand langsung ke output
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error("Mismatched Parentheses");
      stack.pop(); // Pop '('
    } else if (isOperator(token)) {
      while (
        stack.length &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }
  });

  while (stack.length) {
    if (stack[stack.length - 1] === "(")
      throw new Error("Mismatched Parentheses");
    output.push(stack.pop());
  }
  return output;
};

// 3. Logic: Prefix to Postfix
const prefixToPostfix = (tokens) => {
  let stack = [];
  // Scan dari kanan ke kiri
  for (let i = tokens.length - 1; i >= 0; i--) {
    let token = tokens[i];
    if (isOperator(token)) {
      if (stack.length < 2) throw new Error("Invalid Prefix Expression");
      let op1 = stack.pop();
      let op2 = stack.pop();
      stack.push(`${op1} ${op2} ${token}`);
    } else {
      stack.push(token);
    }
  }
  if (stack.length !== 1) throw new Error("Invalid Prefix Expression");
  // Hasil di stack adalah string, perlu ditokenize ulang untuk standar output
  return tokenize(stack.pop());
};

// 4. Logic: Postfix to Infix (Konversi Akhir)
const postfixToInfix = (tokens) => {
  let stack = [];
  tokens.forEach((token) => {
    if (!isNaN(token)) {
      stack.push(token);
    } else if (isOperator(token)) {
      if (stack.length < 2) throw new Error("Invalid Postfix Expression");
      let b = stack.pop();
      let a = stack.pop();
      stack.push(`(${a} ${token} ${b})`);
    }
  });
  if (stack.length !== 1) throw new Error("Invalid Expression");
  return stack[0];
};

// 5. Logic: Postfix to Prefix (Konversi Akhir)
const postfixToPrefix = (tokens) => {
  let stack = [];
  tokens.forEach((token) => {
    if (!isNaN(token)) {
      stack.push(token);
    } else if (isOperator(token)) {
      if (stack.length < 2) throw new Error("Invalid Postfix Expression");
      let b = stack.pop();
      let a = stack.pop();
      stack.push(`${token} ${a} ${b}`);
    }
  });
  if (stack.length !== 1) throw new Error("Invalid Expression");
  return stack[0];
};

// --- MAIN INTERFACE ---

export const convertExpression = (input, fromType, toType) => {
  try {
    const tokens = tokenize(input);
    let postfixTokens = [];

    // Langkah 1: Normalisasi ke Postfix
    if (fromType === "infix") postfixTokens = infixToPostfix(tokens);
    else if (fromType === "postfix") postfixTokens = tokens; // Sudah postfix
    else if (fromType === "prefix") postfixTokens = prefixToPostfix(tokens);

    // Validasi sederhana: Postfix harus valid agar bisa dikonversi
    // Kita bisa melakukan dry-run evaluasi di sini jika perlu validasi ketat

    // Langkah 2: Konversi dari Postfix ke Target
    if (toType === "postfix") return postfixTokens.join(" ");
    if (toType === "infix") return postfixToInfix(postfixTokens);
    if (toType === "prefix") return postfixToPrefix(postfixTokens);
  } catch (err) {
    return `Error: ${err.message}`;
  }
  return "Unknown Conversion Type";
};

export const validateExpression = (input, type) => {
  // Kita "meminjam" fungsi convert untuk validasi.
  // Jika convert melempar error, berarti tidak valid.
  const res = convertExpression(input, type, "postfix");
  return !res.startsWith("Error");
};
// FUNGSI BARU: Menghitung hasil dari array token Postfix
const evaluatePostfix = (tokens) => {
  let stack = [];

  for (let token of tokens) {
    // Jika token adalah angka (operand)
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    }
    // Jika token adalah operator
    else if (isOperator(token)) {
      if (stack.length < 2)
        throw new Error("Invalid Expression for Calculation");

      // Perhatikan urutan: pop pertama adalah operand kedua (B), pop kedua adalah operand pertama (A)
      const b = stack.pop();
      const a = stack.pop();

      let result = 0;
      switch (token) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          if (b === 0) throw new Error("Division by Zero");
          result = a / b;
          break;
        default:
          throw new Error("Unknown Operator");
      }
      stack.push(result);
    }
  }

  if (stack.length !== 1) throw new Error("Calculation Error");
  return stack[0];
};

export const processExpression = (input, fromType, toType) => {
  try {
    const tokens = tokenize(input);
    let postfixTokens = [];

    // 1. Normalisasi ke Postfix (IR)
    if (fromType === "infix") postfixTokens = infixToPostfix(tokens);
    else if (fromType === "postfix") postfixTokens = tokens;
    else if (fromType === "prefix") postfixTokens = prefixToPostfix(tokens);

    // 2. Konversi String (Output Notasi)
    let convertedStr = "";
    if (toType === "postfix") convertedStr = postfixTokens.join(" ");
    else if (toType === "infix") convertedStr = postfixToInfix(postfixTokens);
    else if (toType === "prefix") convertedStr = postfixToPrefix(postfixTokens);

    // 3. Kalkulasi Nilai (Output Angka)
    // Kita hitung dari postfixTokens yang sudah bersih
    const calculatedValue = evaluatePostfix(postfixTokens);

    return {
      status: "success",
      converted: convertedStr,
      value: calculatedValue,
    };
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
};
