import React, { useState } from 'react';
import DebateSetup from './DebateSetup';
import ChatInterface from './ChatInterface';
import { startDebate, continueDebate } from '../services/api';

function DebateApp() {
  const [messages, setMessages] = useState([]);
  const [isDebating, setIsDebating] = useState(false);
  const [topic, setTopic] = useState('');
  const [proAI, setProAI] = useState('claude');
  const [conAI, setConAI] = useState('gpt');
  const [loading, setLoading] = useState(false);
  const [debateTitle, setDebateTitle] = useState('');
  const [firstSpeaker, setFirstSpeaker] = useState(null);

  const handleStartDebate = async (setupData) => {
    const { topic, proAI, conAI, firstSpeaker: initialSpeaker, analysis } = setupData;
    setTopic(topic);
    setProAI(proAI);
    setConAI(conAI);
    setDebateTitle(analysis.title);
    setFirstSpeaker(initialSpeaker);
    setIsDebating(true);
    setLoading(true);
    
    try {
      const currentAI = initialSpeaker === 'pro' ? proAI : conAI;
      const response = await startDebate(topic, currentAI, initialSpeaker);
      
      setMessages([{
        content: response.message,
        ai: response.ai,
        role: initialSpeaker
      }]);
    } catch (error) {
      console.error('Error starting debate:', error);
      alert('Failed to start debate. Please try again.');
    }
    setLoading(false);
  };

  const handleContinueDebate = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const lastDebateMessage = [...messages].reverse().find(m => m.role !== 'moderator');
      const nextRole = lastDebateMessage?.role === 'pro' ? 'con' : 'pro';
      const currentAI = nextRole === 'pro' ? proAI : conAI;
      
      const response = await continueDebate(topic, messages, currentAI, nextRole);
      
      const newMessage = {
        content: response.message,
        ai: response.ai,
        role: nextRole
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error continuing debate:', error);
      alert(`Failed to continue debate: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInterject = async (interjection, nextSpeaker) => {
    setLoading(true);
    try {
      const updatedMessages = [...messages, interjection];
      setMessages(updatedMessages);
      
      const currentAI = nextSpeaker === 'pro' ? proAI : conAI;
      const response = await continueDebate(topic, updatedMessages, currentAI, nextSpeaker);
      
      setMessages(prev => [...prev, {
        content: response.message,
        ai: response.ai,
        role: nextSpeaker
      }]);
    } catch (error) {
      console.error('Error handling interjection:', error);
      alert('Failed to process interjection. Please try again.');
    }
    setLoading(false);
  };

  const handleAnalysis = (analysis) => {
    // Set the title as soon as we get the analysis
    setDebateTitle(analysis.title);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center w-full sticky top-0 bg-white z-10 h-14">
        <h1 className="text-center py-3 text-gray-800">
          {debateTitle}
        </h1>
      </div>

      <div className="flex flex-col flex-grow justify-center">
        {!isDebating ? (
          <div className="mx-auto h-full flex items-center justify-center">
            <DebateSetup 
              onStart={handleStartDebate} 
              onAnalysis={handleAnalysis}
            />
          </div>
        ) : (
          <ChatInterface
            topic={topic}
            messages={messages}
            loading={loading}
            onContinue={handleContinueDebate}
            onInterject={handleInterject}
            proAI={proAI}
            conAI={conAI}
            firstSpeaker={firstSpeaker}
          />
        )}
      </div>
    </div>
  );
}

export default DebateApp; 