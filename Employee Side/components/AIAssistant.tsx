import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Report, ChatMessage } from '../types';
import { AIChatService } from '../services/geminiService';
import { XIcon, PaperAirplaneIcon, BotIcon } from './icons/Icons';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, reports }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatService = useMemo(() => new AIChatService(reports, history), [reports, history]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isLoading]);
  
  // Reset history when the component is closed.
  useEffect(() => {
    if (!isOpen) {
        setHistory([]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputValue }] };
    setHistory(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const stream = await chatService.sendMessageStream(userMessage.parts[0].text);
      
      let modelResponse = '';
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
          return newHistory;
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div 
        className="fixed bottom-6 right-6 w-[440px] h-[600px] bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-dark-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <BotIcon className="w-7 h-7 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 && (
             <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                <p>Welcome! Ask me anything about the pothole reports.</p>
                <p className="text-xs mt-2">Examples: "How many critical reports are there?" or "List reports assigned to Alice".</p>
            </div>
          )}
          {history.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-bg flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-5 h-5 text-brand-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-brand-primary text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-bg flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-5 h-5 text-brand-primary" />
                </div>
                 <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200 rounded-bl-none">
                     <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
                     </div>
                </div>
            </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t dark:border-dark-border flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about reports..."
              className="flex-1 w-full pl-4 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-bg border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
