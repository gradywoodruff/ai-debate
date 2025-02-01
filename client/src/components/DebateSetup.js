import React, { useState, useRef, useEffect } from 'react';
import { analyzeTopic } from '../services/api';
import { Loader2 } from 'lucide-react';

function DebateSetup({ onStart, onAnalysis }) {
  const [topic, setTopic] = useState('');
  const [proAI, setProAI] = useState('claude');
  const [conAI, setConAI] = useState('gpt');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [coinResult, setCoinResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [topic]);

  const handleAnalyzeTopic = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setLoading(true);
    try {
      const result = await analyzeTopic(topic);
      setAnalysis(result);
      onAnalysis(result);
    } catch (error) {
      alert('Failed to analyze topic. Please try again.');
      setIsAnalyzing(false);
    }
    setLoading(false);
  };

  const handleStartDebate = async (e) => {
    e.preventDefault();
    setShowCoinFlip(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setCoinResult(result);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    onStart({
      topic,
      proAI,
      conAI,
      firstSpeaker: result === 'heads' ? 'pro' : 'con',
      analysis
    });
  };

  return (
    <form onSubmit={isAnalyzing ? handleStartDebate : handleAnalyzeTopic} style={{ width: '1000px' }}>
      <div className="space-y-6">
        <div className={`
          bg-white transition-all duration-500 ease-out
          ${isAnalyzing ? 'mb-12' : ''}
        `}>
          <textarea
            ref={textAreaRef}
            required
            placeholder="Debate statement"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isAnalyzing}
            className={`
              w-full border-none rounded-lg 
              focus:outline-none focus:none resize-none 
              placeholder:text-purple-200
              transition-all duration-500 disabled:bg-white
              ${isAnalyzing ? 'text-4xl' : 'text-8xl'}
            `}
          />
        </div>

        <div className={`
          transition-all duration-500 ease-out
          ${isAnalyzing ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}
        `}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-bold uppercase text-sm text-green-600">For</label>
              {analysis && <p className="text-sm text-gray-600 mb-4">{analysis.proSummary}</p>}
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
              <label className="font-bold uppercase text-sm text-red-600">Against</label>
              {analysis && <p className="text-sm text-gray-600 mb-4">{analysis.conSummary}</p>}
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
        </div>

        <button
          type="submit"
          disabled={!topic || loading}
          className={`
            px-12 py-6 text-lg
            bg-purple-600 text-white
            hover:bg-purple-700
            disabled:bg-purple-300
            transition-colors
            rounded-lg
            w-auto
            flex items-center justify-center gap-2
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Topic...
            </>
          ) : isAnalyzing ? (
            'Start Debate'
          ) : (
            'Next'
          )}
        </button>
      </div>

      {showCoinFlip && (
        <div className="fixed inset-0 bg-purple-600 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className={`
              w-32 h-32 mx-auto mb-8 rounded-full bg-white
              ${coinResult ? 'animate-none' : 'animate-flip'}
            `}>
              {coinResult && (
                <div className="h-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                  {coinResult.toUpperCase()}
                </div>
              )}
            </div>
            <p className="text-2xl font-medium text-white mb-8">
              {coinResult ? (
                `${coinResult === 'heads' ? 'Pro' : 'Con'} Side Goes First!`
              ) : (
                'Flipping coin...'
              )}
            </p>
            {coinResult && (
              <p className="text-xl text-white/80">
                Preparing debate
                <span className="animate-ellipsis">...</span>
              </p>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default DebateSetup; 