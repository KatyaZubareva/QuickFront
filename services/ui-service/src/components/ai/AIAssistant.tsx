// src/components/ai/AIAssistant.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AI_API } from "../ai/ai.api";

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  onNewMessage?: () => void;
  currentStep?: number;
  selectedFramework?: string | null;
  selectedFeatures?: string[];
  selectedTemplate?: string | null;
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onSuggestion,
  onNewMessage = () => {},
  currentStep = 1,
  selectedFramework = null,
  selectedFeatures = [],
  selectedTemplate = null,
  className = ""
}) => {
  const [messages, setMessages] = useState<Array<{ 
    role: string; 
    content: string; 
    timestamp?: Date;
    modelInfo?: {
      model: string;
      provider?: string;
    };
  }>>([
    {
      role: "assistant",
      content: "Здравствуйте! Я ваш виртуальный помощник на базе GigaChat. Как я могу помочь с настройкой вашего проекта?",
      timestamp: new Date(),
      modelInfo: {
        model: "GigaChat",
        provider: "Sberbank"
      }
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (messages[messages.length - 1].role === "assistant" && onNewMessage) {
      onNewMessage();
    }
  }, [messages, onNewMessage, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await AI_API.getRecommendation(
        input,
        {
          currentStep,
          framework: selectedFramework,
          features: selectedFeatures,
          template: selectedTemplate
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.suggestion,
        timestamp: new Date(),
        modelInfo: {
          model: response.details?.model || "GigaChat",
          provider: "Sberbank"
        }
      };

      setMessages((prev) => [...prev, aiMessage]);
      onSuggestion(response.suggestion);
    } catch (err) {
      console.error("GigaChat API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка при подключении к GigaChat. Попробуйте еще раз позже.",
          timestamp: new Date()
        }
      ]);
      setError("Не удалось подключиться к GigaChat. Проверьте соединение и попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="relative mr-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
            </div>
            <span>AI помощник</span>
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[400px] space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={`msg-${index}-${message.timestamp?.getTime()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "assistant"
                  ? "bg-gray-700/60 text-gray-100 rounded-tl-none"
                  : "bg-indigo-600 text-white rounded-tr-none"
              }`}
              aria-label={`${message.role} message`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.timestamp && (
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {message.role === "assistant" && message.modelInfo && (
                    <p className="text-xs opacity-50">
                      {message.modelInfo.provider} ({message.modelInfo.model})
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700/60 text-gray-100 rounded-2xl px-4 py-3 rounded-tl-none max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm p-2 bg-red-900/20 rounded-lg"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-300 hover:text-white"
              aria-label="Ошибка"
            >
              ×
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <form onSubmit={handleSendMessage}>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent placeholder-gray-400 resize-none"
              placeholder="Спросите о настройке проекта..."
              aria-label="Введите ваше сообщение"
              disabled={isLoading}
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-purple-400 disabled:opacity-50"
              aria-label="Отправить сообщение"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};