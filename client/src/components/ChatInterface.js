import React, { useEffect, useRef } from 'react';

function ChatInterface({ messages, loading, onContinue }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 h-[70vh]">
      <div className="flex flex-col gap-4 flex-grow overflow-y-auto p-4 min-h-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 max-w-[80%] rounded-lg shadow ${
              message.role === 'pro' 
                ? 'bg-pro-bg self-start' 
                : 'bg-con-bg self-end'
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">
              {message.ai.toUpperCase()} ({message.role.toUpperCase()})
            </div>
            <div className="break-words">
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <button
        onClick={onContinue}
        disabled={loading}
        className={`
          mt-2 px-6 py-2 rounded-lg
          bg-blue-600 text-white
          hover:bg-blue-700
          disabled:bg-blue-300
          transition-colors
          flex items-center justify-center
        `}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Continue Debate'
        )}
      </button>
    </div>
  );
}

export default ChatInterface; 