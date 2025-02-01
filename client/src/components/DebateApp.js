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

  const handleStartDebate = async (setupData) => {
    setLoading(true);
    try {
      const { topic, proAI, conAI, firstSpeaker, analysis } = setupData;
      setTopic(topic);
      setProAI(proAI);
      setConAI(conAI);
      setDebateTitle(analysis.title);
      
      const currentAI = firstSpeaker === 'pro' ? proAI : conAI;
      const response = await startDebate(topic, currentAI, firstSpeaker);
      
      setMessages([{
        content: response.message,
        ai: response.ai,
        role: firstSpeaker
      }]);
      setIsDebating(true);
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
      // Find the last non-moderator message to determine next speaker
      const lastDebateMessage = [...messages].reverse().find(m => m.role !== 'moderator');
      const nextRole = lastDebateMessage?.role === 'pro' ? 'con' : 'pro';
      const currentAI = nextRole === 'pro' ? proAI : conAI;
      
      const response = await continueDebate(topic, messages, currentAI);
      
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
      // Add the interjection to messages
      const updatedMessages = [...messages, interjection];
      setMessages(updatedMessages);
      
      // Continue the debate with the specified next speaker
      const currentAI = nextSpeaker === 'pro' ? proAI : conAI;
      const response = await continueDebate(topic, updatedMessages, currentAI);
      
      // Use nextSpeaker to determine the role instead of message length
      setMessages(prev => [...prev, {
        content: response.message,
        ai: response.ai,
        role: nextSpeaker // This ensures the role matches what we selected
      }]);
    } catch (error) {
      console.error('Error handling interjection:', error);
      alert('Failed to process interjection. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full">
      {!isDebating ? (
        <div className="mx-auto h-screen flex items-center justify-center">
          <DebateSetup onStart={handleStartDebate} />
        </div>
      ) : (
        <ChatInterface
          messages={messages}
          loading={loading}
          onContinue={handleContinueDebate}
          onInterject={handleInterject}
          proAI={proAI}
          conAI={conAI}
          debateTitle={debateTitle}
        />
      )}
    </div>
  );
}

export default DebateApp; 