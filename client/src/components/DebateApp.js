import React, { useState } from 'react';
import DebateSetup from './DebateSetup';
import ChatInterface from './ChatInterface';
import { startDebate, continueDebate, generateTitle } from '../services/api';

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
      const { topic, proAI, conAI } = setupData;
      setTopic(topic);
      setProAI(proAI);
      setConAI(conAI);
      
      const response = await startDebate(topic, proAI, conAI);
      
      // Generate title using the API service
      try {
        const titleResponse = await generateTitle(response.message);
        setDebateTitle(titleResponse.title);
      } catch (titleError) {
        console.error('Error generating title:', titleError);
        setDebateTitle(topic); // Fallback to using the topic as the title
      }
      
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
    <div className="w-full h-full">
      {!isDebating ? (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <DebateSetup onStart={handleStartDebate} />
          </div>
        </div>
      ) : (
        <ChatInterface
          messages={messages}
          loading={loading}
          onContinue={handleContinueDebate}
          proAI={proAI}
          conAI={conAI}
          debateTitle={debateTitle}
        />
      )}
    </div>
  );
}

export default DebateApp; 