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

  const handleStartDebate = async (setupData) => {
    setLoading(true);
    try {
      const { topic, proAI, conAI } = setupData;
      setTopic(topic);
      setProAI(proAI);
      setConAI(conAI);
      
      const response = await startDebate(topic, proAI, conAI);
      setMessages([{
        content: response.message,
        ai: response.ai,
        role: response.role
      }]);
      setIsDebating(true);
    } catch (error) {
      console.error('Error starting debate:', error.response?.data || error.message);
      alert('Failed to start debate. Please try again.');
    }
    setLoading(false);
  };

  const handleContinueDebate = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const currentAI = messages.length % 2 === 0 ? proAI : conAI;
      console.log('Current messages:', messages);
      console.log('Continuing debate with:', {
        currentAI,
        messagesLength: messages.length,
        topic
      });
      
      const response = await continueDebate(topic, messages, currentAI);
      console.log('Got response:', response);
      
      const newMessage = {
        content: response.message,
        ai: response.ai,
        role: response.role
      };
      console.log('Adding new message:', newMessage);
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        console.log('Updated messages:', updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error continuing debate:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        fullError: error
      });
      alert(`Failed to continue debate: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {!isDebating ? (
          <DebateSetup onStart={handleStartDebate} />
        ) : (
          <ChatInterface
            messages={messages}
            loading={loading}
            onContinue={handleContinueDebate}
            proAI={proAI}
            conAI={conAI}
          />
        )}
      </div>
    </div>
  );
}

export default DebateApp; 