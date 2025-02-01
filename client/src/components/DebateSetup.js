import React, { useState, useRef, useEffect } from 'react';
import { analyzeTopic } from '../services/api';
import { Loader2 } from 'lucide-react';

function DebateSetup({ onStart }) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [proAI, setProAI] = useState('claude');
  const [conAI, setConAI] = useState('gpt');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [coinResult, setCoinResult] = useState(null);
  const textAreaRef = useRef(null)

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }
  }, [topic])

  const handleAnalyzeTopic = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await analyzeTopic(topic);
      setAnalysis(result);
      setStep(2);
    } catch (error) {
      alert('Failed to analyze topic. Please try again.');
    }
    setLoading(false);
  };

  const handleStartDebate = async (e) => {
    e.preventDefault();
    setShowCoinFlip(true);
    
    // Animate coin flip and show result
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setCoinResult(result);
    
    // Wait to show the result for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start debate with determined first speaker
    onStart({
      topic,
      proAI,
      conAI,
      firstSpeaker: result === 'heads' ? 'pro' : 'con',
      analysis
    });
  };

  if (step === 1) {
    return (
      <form onSubmit={handleAnalyzeTopic} className="flex flex-col gap-6">
        <textarea
          ref={textAreaRef}
          required
          placeholder="Debate statement"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border-none text-8xl rounded-lg focus:outline-none focus:none resize-none placeholder:text-purple-200"
        />
        <button
          type="submit"
          disabled={!topic || loading}
          className={`
            fixed bottom-0 left-0 right-0
            px-6 py-3 text-lg
            bg-purple-600 text-white
            hover:bg-purple-700
            disabled:bg-purple-300
            transition-colors
            flex items-center justify-center gap-2
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Topic...
            </>
          ) : (
            'Next'
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleStartDebate} className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">{analysis.title}</h2>
      
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="font-medium text-green-700">Supporting Position</h3>
          <p className="text-sm text-gray-600">{analysis.proSummary}</p>
        </div>
        <div>
          <h3 className="font-medium text-red-700">Opposing Position</h3>
          <p className="text-sm text-gray-600">{analysis.conSummary}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600">Supporting Side</label>
          <select
            value={proAI}
            onChange={(e) => setProAI(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="claude">Claude</option>
            <option value="gpt">GPT-4</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-600">Opposing Side</label>
          <select
            value={conAI}
            onChange={(e) => setConAI(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="claude">Claude</option>
            <option value="gpt">GPT-4</option>
          </select>
        </div>
      </div>

      {!showCoinFlip && (
        <button
          type="submit"
          className="
            fixed bottom-0 left-0 right-0
            px-6 py-3 text-lg
            bg-purple-600 text-white
            hover:bg-purple-700
            transition-colors
          "
        >
          Start Debate
        </button>
      )}

      {showCoinFlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className={`
              w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600
              ${coinResult ? 'animate-none' : 'animate-flip'}
            `}>
              {coinResult && (
                <div className="h-full flex items-center justify-center text-white font-bold">
                  {coinResult.toUpperCase()}
                </div>
              )}
            </div>
            <p className="text-lg font-medium">
              {coinResult ? (
                `${coinResult === 'heads' ? 'Pro' : 'Con'} Side Goes First!`
              ) : (
                'Flipping coin...'
              )}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

export default DebateSetup; 