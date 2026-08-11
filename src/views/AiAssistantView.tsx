import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, Bot, User, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { UserProfile, AiChatMessage } from '../types';
import { sendAiQuery } from '../services/aiService';

interface AiAssistantViewProps {
  currentUser: UserProfile;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ currentUser }) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'AI',
      text: `Hello ${currentUser.name}! I am **KDLH AI Assistant**, your intelligent academic partner at Kizimba Digital Learning Hub.
Founded by **ISAACK EDWARD LUNGWA**.
Tagline: **LEARN • PRACTICE • ASK • IMPROVE**

How can I assist your study or lesson preparation today?`,
      timestamp: 'Just now'
    }
  ]);

  const promptPresets = [
    "Teach me naming of alcohols from beginner level.",
    "Generate 5 Form IV Chemistry questions about alcohols with answers and marking points.",
    "Explain Ohm's Law and calculate current for 12V across 4 Ohms.",
    "Explain Mendel's Laws of Inheritance for Form IV Biology."
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const result = await sendAiQuery({
        prompt: textToSend,
        userRole: currentUser.role,
        form: currentUser.form || 'Form IV',
        subject: 'General Academic'
      });

      const aiMsg: AiChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'AI',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: result.citations as any
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-mono">
      
      {/* Header */}
      <div className="bg-black/60 text-cyan-100 p-6 sm:p-8 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> KDLH Intelligent Academic Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">KDLH AI Assistant</h1>
          <p className="text-xs sm:text-sm text-cyan-300/80 font-sans">"Your intelligent learning companion for secondary education."</p>
        </div>

        <div className="text-right text-xs text-cyan-300/80 hidden sm:block">
          <p>Founder: <strong className="text-white">ISAACK EDWARD LUNGWA</strong></p>
          <p className="text-cyan-400 font-bold uppercase tracking-wider">LEARN • PRACTICE • ASK • IMPROVE</p>
        </div>
      </div>

      {/* Preset Prompt Shortcuts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Suggested Questions:</span>
        <div className="flex flex-wrap gap-2">
          {promptPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-xs bg-black/40 hover:bg-cyan-950/60 text-cyan-200 border border-cyan-900/50 hover:border-cyan-500/50 px-3 py-1.5 rounded-xl font-medium transition-all shadow-xs text-left"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-black/70 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-[580px] backdrop-blur-xl">
        
        {/* Messages Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-cyan-950/20">
          {messages.map((m) => {
            const isAi = m.sender === 'AI';
            return (
              <div key={m.id} className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
                
                {isAi && (
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-2 ${
                  isAi ? 'bg-black/80 p-5 rounded-2xl border border-cyan-900/50 text-cyan-100 shadow-sm' : 'bg-cyan-950/90 text-cyan-100 border border-cyan-500/40 p-4 rounded-2xl shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[11px] text-cyan-400/80 pb-1 border-b border-cyan-900/40 font-mono">
                    <span className="font-bold">{isAi ? 'KDLH AI Assistant' : currentUser.name}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                    {m.text}
                  </div>

                  {m.citations && m.citations.length > 0 && (
                    <div className="pt-2 border-t border-cyan-900/40 text-[11px] text-cyan-300 font-semibold flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Source: [{m.citations[0].title}]</span>
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <User className="w-5 h-5" />
                  </div>
                )}

              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-cyan-300 p-4 bg-black/80 rounded-2xl border border-cyan-900/50 w-fit animate-pulse font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>KDLH AI is thinking & retrieving academic sources...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-black/80 border-t border-cyan-900/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask KDLH AI e.g. Teach me naming of alcohols step by step..."
              className="flex-1 px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans text-white placeholder:text-cyan-600"
            />

            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_10px_#22d3ee]"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
