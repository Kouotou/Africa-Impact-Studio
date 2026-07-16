// src/components/chatbot/LeGardienChatbot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Send, Sparkles, MessageSquare, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface ChatbotProps {
  lang: 'fr' | 'en';
  dict: any;
}

export default function LeGardienChatbot({ lang, dict }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: dict.chatbot.welcome,
        timestamp: new Date(),
      },
    ]);
  }, [dict]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    // Scan for risk warnings
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('danger') ||
      lowerText.includes('threat') ||
      lowerText.includes('harcèl') ||
      lowerText.includes('bully') ||
      lowerText.includes('menace')
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || dict.chatbot.welcome,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: dict.chatbot.welcome,
        timestamp: new Date(),
      },
    ]);
    setShowWarning(false);
  };

  const presetQuestions = lang === 'fr' 
    ? [
        "Comment sécuriser mon mot de passe ?",
        "Qu'est-ce que le phishing ?",
        "Qui sont les Gardiens du Quartier ?"
      ]
    : [
        "How do I secure my password?",
        "What is phishing?",
        "Who are the Guardians?"
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[90vw] sm:w-[380px] h-[500px] rounded-2xl glass shadow-2xl flex flex-col overflow-hidden mb-4 border border-[var(--color-border)]"
          >
            {/* Header */}
            <div className="bg-gradient-green-dark p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-terracotta-gold flex items-center justify-center shadow-inner relative">
                  <ShieldAlert className="w-5 h-5 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide flex items-center gap-1">
                    {dict.chatbot.title} <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                  </h3>
                  <p className="text-[10px] opacity-75 font-semibold tracking-wider uppercase">
                    {dict.chatbot.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
                  title={dict.chatbot.reset}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warning Banner */}
            {showWarning && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-semibold animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {lang === 'fr' 
                    ? "Besoin d'aide ? N'hésite pas à parler de tout comportement suspect à un adulte." 
                    : "Need help? Feel free to report any suspicious behavior to an adult."}
                </span>
              </div>
            )}

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-4 flex flex-col scrollbar-thin"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-terracotta text-white rounded-br-none'
                        : 'bg-deep-green/5 dark:bg-off-white/5 border border-[var(--color-border)] text-deep-green dark:text-off-white rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[8px] opacity-60 text-right mt-1 font-semibold">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-deep-green/5 dark:bg-off-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center border border-[var(--color-border)]">
                    <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Presets Grid */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 flex flex-col gap-2 bg-deep-green/2">
                <p className="text-[9px] uppercase tracking-wider font-bold opacity-60">
                  {lang === 'fr' ? 'Suggestions de questions :' : 'Suggested questions:'}
                </p>
                <div className="flex flex-col gap-1.5">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="text-left text-[11px] font-semibold p-2 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] hover:border-terracotta hover:text-terracotta transition-all cursor-pointer shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputVal);
              }}
              className="p-3 border-t border-[var(--color-border)] flex gap-2 bg-white/50 dark:bg-charcoal/50"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={dict.chatbot.placeholder}
                className="flex-grow px-3 py-2 text-xs rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta font-medium"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-deep-green dark:bg-terracotta text-white hover:bg-deep-green-light dark:hover:bg-terracotta-light transition-colors cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-terracotta-gold text-white flex items-center justify-center shadow-2xl relative cursor-pointer group"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-deep-green rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse border border-white">
          !
        </span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
