import React, { useEffect, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

function ChatInterface({ topic,messages, loading, onContinue, proAI, conAI, onInterject, firstSpeaker }) {
  const messagesEndRef = useRef(null);
  const [showInterjectModal, setShowInterjectModal] = useState(false);
  const [interjection, setInterjection] = useState('');
  const [nextSpeaker, setNextSpeaker] = useState('pro');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInterject = () => {
    // Add the interjection to messages and close modal
    const newMessage = {
      content: interjection,
      role: 'moderator',
      ai: 'human'
    };
    
    // Here you would need to update your parent component's messages state
    // You'll need to add an onInterject prop and handle this in DebateApp.js
    onInterject(newMessage, nextSpeaker);
    
    setInterjection('');
    setShowInterjectModal(false);
  };

  // Determine who's typing
  const getTypingRole = () => {
    if (!messages.length) return firstSpeaker; // Use firstSpeaker instead of defaulting to 'pro'
    const lastMessage = messages[messages.length - 1];
    return lastMessage.role === 'pro' ? 'con' : 'pro';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full flex-grow">
      <div className="w-full space-y-6 h-full flex-grow py-12" style={{ maxWidth: '1000px' }}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-semibold text-purple-600 mb-1">
            Resolution
          </span>
          <p className="text-sm text-gray-700 italic">
            {topic}
          </p>
        </div>
        {messages.map((message, index) => (
          message.role === 'moderator' ? (
            // Moderator message - centered with no bubble
            <div key={index} className="flex flex-col items-center text-center px-4">
              <span className="text-sm font-semibold text-purple-600 mb-1">
                Moderator
              </span>
              <p className="text-sm text-gray-700 italic">
                {message.content}
              </p>
            </div>
          ) : (
            // Regular debate message - using message.role instead of index
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
                  <div className="text-xs font-medium">
                    {message.ai || (message.role === 'pro' ? proAI : conAI)}
                  </div>
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
          )
        ))}
        
        {/* Typing Indicator */}
        {(loading || (!messages.length)) && (
          <div 
            className={`flex ${getTypingRole() === 'pro' ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] flex items-end gap-2 ${
                getTypingRole() === 'pro' ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`flex flex-col items-center ${
                  getTypingRole() === 'pro' ? "text-green-600" : "text-red-600"
                }`}
              >
                {getTypingRole() === 'pro' ? (
                  <ThumbsUp className="w-5 h-5 mb-1" />
                ) : (
                  <ThumbsDown className="w-5 h-5 mb-1" />
                )}
                <div className="text-xs font-medium">
                  {getTypingRole() === 'pro' ? proAI : conAI}
                </div>
              </div>
              <div
                className={`p-4 rounded-2xl bg-white ${
                  getTypingRole() === 'pro'
                    ? "border border-green-400 border-l-[6px]"
                    : "border border-red-400 border-r-[6px]"
                }`}
              >
                <div className="flex space-x-1 h-5 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full sticky bottom-0 bg-white p-4 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={onContinue}
            disabled={loading || !messages.length}
            className={`
              flex-1 px-6 py-2 rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:bg-blue-300
              transition-colors
              flex items-center justify-center gap-2
            `}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Continue Debate'
            )}
          </button>
          <button
            onClick={() => setShowInterjectModal(true)}
            disabled={loading || !messages.length}
            className={`
              px-6 py-2 rounded-lg
              bg-purple-600 text-white
              hover:bg-purple-700
              disabled:bg-purple-300
              transition-colors
              flex items-center justify-center gap-2
            `}
          >
            <MessageCircle className="w-5 h-5" />
            Interject
          </button>
        </div>
      </div>

      {showInterjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold">Add Your Interjection</h2>
            <textarea
              value={interjection}
              onChange={(e) => setInterjection(e.target.value)}
              placeholder="Type your interjection here..."
              className="w-full h-32 p-2 border rounded-lg resize-none"
            />
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Next Speaker</label>
              <select
                value={nextSpeaker}
                onChange={(e) => setNextSpeaker(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="pro">{proAI} (Pro)</option>
                <option value="con">{conAI} (Con)</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowInterjectModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleInterject}
                disabled={!interjection.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface; 