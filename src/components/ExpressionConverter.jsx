import React, { useState } from "react";
import { processExpression } from "../utils/PdaLogic";
import {
  ArrowRightLeft,
  Calculator,
  Copy,
  Terminal,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ExpressionConverter = () => {
  const [input, setInput] = useState("");
  const [fromType, setFromType] = useState("infix");
  const [toType, setToType] = useState("postfix");
  const [output, setOutput] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) return;

    // Sedikit "fake loading" agar terasa seperti mesin sedang bekerja
    setIsAnimating(true);
    setOutput(null);

    setTimeout(() => {
      const result = processExpression(input, fromType, toType);
      setOutput(result);
      setIsAnimating(false);
    }, 300);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Bisa diganti dengan toast notif yang lebih cantik
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
      {/* Main Card container with subtle gradient border effect */}
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
        {/* Decorative gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 blur-sm"></div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Terminal size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              PDA Engine
            </h2>
          </div>
          <p className="text-slate-400 text-sm">
            Pushdown Automata based expression parser & evaluator.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* INPUT SECTION */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Input Expression
            </label>
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. ( 10 + 20 ) * 5"
                className="w-full bg-slate-950 border border-slate-700 text-white p-4 rounded-xl font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-700"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                <Calculator size={20} />
              </div>
            </div>
          </div>

          {/* CONTROLS SECTION */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
            {/* From */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                From Format
              </label>
              <select
                value={fromType}
                onChange={(e) => setFromType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none cursor-pointer hover:bg-slate-750 transition"
              >
                <option value="infix">Infix (A+B)</option>
                <option value="postfix">Postfix (AB+)</option>
                <option value="prefix">Prefix (+AB)</option>
              </select>
            </div>

            {/* Arrow Icon */}
            <div className="pb-3 text-slate-600 flex justify-center">
              <ArrowRightLeft size={20} />
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                To Format
              </label>
              <select
                value={toType}
                onChange={(e) => setToType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500/50 outline-none appearance-none cursor-pointer hover:bg-slate-750 transition"
              >
                <option value="postfix">Postfix (AB+)</option>
                <option value="infix">Infix (A+B)</option>
                <option value="prefix">Prefix (+AB)</option>
              </select>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleConvert}
            disabled={!input || isAnimating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnimating ? "Processing..." : "Run Computation"}
          </button>

          {/* OUTPUT SECTION */}
          {output && (
            <div
              className={`rounded-xl overflow-hidden border animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                output.status === "success"
                  ? "bg-slate-950 border-slate-800"
                  : "bg-red-950/20 border-red-900/50"
              }`}
            >
              {output.status === "success" ? (
                <div className="divide-y divide-slate-800">
                  {/* Converted String */}
                  <div className="p-5 flex items-center justify-between group">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Converted Notation
                      </p>
                      <p className="font-mono text-lg text-blue-300">
                        {output.converted}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(output.converted)}
                      className="p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-md transition opacity-0 group-hover:opacity-100"
                      title="Copy"
                    >
                      <Copy size={18} />
                    </button>
                  </div>

                  {/* Calculated Result */}
                  <div className="p-5 bg-slate-900/50 flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Final Result
                      </p>
                      <p className="font-mono text-3xl font-bold text-white tracking-tight">
                        {Number(output.value)
                          .toFixed(4)
                          .replace(/\.?0+$/, "")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Error State
                <div className="p-6 flex items-start gap-4">
                  <div className="text-red-500 mt-1">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-red-400 text-lg">
                      Syntax Error
                    </p>
                    <p className="text-red-300/80 text-sm mt-1">
                      {output.message}
                    </p>
                    <p className="text-slate-600 text-xs mt-4 font-mono bg-black/20 p-2 rounded">
                      Tip: Check for unbalanced parentheses or missing
                      operators.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpressionConverter;
