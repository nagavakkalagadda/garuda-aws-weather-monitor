import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Flame, 
  Wind, 
  Droplets,
  Terminal
} from 'lucide-react';
import { askAiAssistant } from '../services/api';

export default function AIAssistantModal({
  isOpen,
  onClose,
  weatherContext
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "garuda",
      text: `Greetings. I am the GARUDA Meteorological AI Copilot. I am actively monitoring telemetry for ${weatherContext?.location?.city || "your station"}. How can I assist you with anomaly diagnostics, thermodynamic formulas, or safety recommendations today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `Why is the anomaly status currently ${weatherContext?.anomaly?.severity || "NORMAL"}?`,
    "Explain the difference between Wet-Bulb and Apparent Temperature",
    "What safety precautions are advised right now?",
    "How does GARUDA's Isolation Forest algorithm work?"
  ];

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isThinking) return;

    const userMsg = { id: Date.now(), sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await askAiAssistant(q, {
        weather: weatherContext?.current,
        location: weatherContext?.location,
        anomaly: weatherContext?.anomaly
      });

      const assistantMsg = {
        id: Date.now() + 1,
        sender: "garuda",
        text: res.answer || "Diagnostic response completed."
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "garuda",
          text: `Telemetry reasoning error: ${err.message}. Defaulting to baseline advisory.`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      
      {/* Sliding Drawer Container */}
      <div className="w-full max-w-lg h-full bg-dark-900 border-l border-cyan-500/30 shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                GARUDA // METEOROLOGICAL COPILOT
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">AI ASSISTANT</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Context: {weatherContext?.location?.city || 'Bengaluru'} • {weatherContext?.current?.temperature || 28}°C ({weatherContext?.anomaly?.severity || 'NORMAL'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                {m.sender === "user" ? "Operator Inquiry" : "GARUDA Copilot"}
              </div>
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[90%] font-sans whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-slate-100"
                    : "bg-dark-850 border border-slate-800 text-slate-200 shadow-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
              <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing atmospheric features and climatological baseline...</span>
            </div>
          )}
        </div>

        {/* Quick Suggested Inquiry Chips */}
        <div className="p-3 border-t border-slate-800/80 bg-dark-850/60">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Suggested Queries for Beginners:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={`qp-${idx}`}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded bg-dark-800 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-slate-700/80 text-[11px] text-slate-300 font-mono transition-all text-left truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-dark-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask GARUDA Copilot about anomalies, safety, or physics..."
              className="flex-1 glass-input px-3.5 py-2.5 rounded-lg text-xs font-mono placeholder:text-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="p-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shrink-0"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
