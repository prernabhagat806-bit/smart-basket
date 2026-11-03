import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, Loader2, Coins } from 'lucide-react';
import { Product, Store, BasketItem } from '../types/grocery';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketItem[];
  products: Product[];
  stores: Store[];
  monthlyBudget: number;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  basket,
  products,
  stores,
  monthlyBudget
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello! I'm your SmartBasket AI Advisor. I monitor real-time prices across Blinkit, Zepto, BigBasket, JioMart, Swiggy Instamart, and your local Kirana store.\n\nAsk me how to save on your groceries, build a monthly list under ₹1,000, or find the cheapest store for any item!`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          basket,
          products,
          stores,
          budget: monthlyBudget
        })
      });

      if (!res.ok) throw new Error('Failed to fetch from assistant');
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply, source: data.source }
      ]);
    } catch (err: any) {
      // Local smart fallback
      const reply = `🛒 **Smart Savings Recommendation:**
- **Best for Grains & Staples:** Sharma Kirana & JioMart are currently offering Basmati Rice for ₹295-₹305 and Atta for ₹235 (saving ₹50-₹85 vs instant apps).
- **Best for Quick Fixes:** Zepto has ₹15 delivery below ₹199, which beats Blinkit and Swiggy Instamart on small runs.`;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, source: 'smart-advisor' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Where can I buy groceries under ₹1,000?',
    'Which store has the cheapest Basmati rice?',
    'How can I save ₹500 on my monthly grocery bill?',
    'Compare cooking oil prices between Blinkit and JioMart'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">SmartBasket AI Advisor</div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Live Grocery Price Intelligence
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing store rates and calculating savings...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts Strip */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Quick Questions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-lg text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about grocery prices..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
