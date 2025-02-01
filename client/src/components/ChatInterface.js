import React, { useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown } from "lucide-react";

function ChatInterface({ messages, loading, onContinue, debateTitle }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return <div className="text-center p-4">No messages to display.</div>
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full sticky top-0 bg-white">
        <h1 className="text-3xl font-bold text-center py-3 text-gray-800">
          {debateTitle || 'AI Debate Arena'}
        </h1>
      </div>
      <div className="max-w-2xl space-y-6 h-full">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'pro' ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] flex items-end gap-2 ${
                message.role === 'pro' ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`flex flex-col items-center ${
                  message.role === 'pro' ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.role === 'pro' ? (
                  <ThumbsUp className="w-5 h-5 mb-1" />
                ) : (
                  <ThumbsDown className="w-5 h-5 mb-1" />
                )}
                <div className="text-xs font-medium">{message.ai}</div>
              </div>
              <div
                className={`p-4 rounded-2xl bg-white ${
                  message.role === 'pro'
                    ? "border border-green-400 border-l-[6px]"
                    : "border border-red-400 border-r-[6px]"
                }`}
              >
                <p className="text-sm text-black">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full sticky bottom-0 bg-white">
        <button
          onClick={onContinue}
          disabled={loading}
          className={`
            mt-4 px-6 py-2 rounded-lg
            bg-blue-600 text-white
            hover:bg-blue-700
            disabled:bg-blue-300
            transition-colors
            flex items-center justify-center
            w-full
          `}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Continue Debate'
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatInterface; 