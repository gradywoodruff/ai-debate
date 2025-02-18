import React from 'react';

const DebateScoreVisualization = ({ scores }) => {
  // Convert -1 to 1 scale to 0 to 100 for positioning
  const getPosition = (score) => ((score + 1) / 2) * 100;
  
  const averageScore = scores?.averageScore || 0;
  const claudeScore = scores?.claude?.score || 0;
  const gptScore = scores?.gpt?.score || 0;
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      {/* Score bar container */}
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Center line */}
        <div className="absolute left-1/2 h-full w-px bg-gray-400"/>
        
        {/* Ghost ratings */}
        <div 
          className="absolute h-4 w-2 bg-gray-400 opacity-30 top-2 rounded"
          style={{ left: `${getPosition(claudeScore)}%` }}
        />
        <div 
          className="absolute h-4 w-2 bg-gray-400 opacity-30 top-2 rounded"
          style={{ left: `${getPosition(gptScore)}%` }}
        />
        
        {/* Average score indicator */}
        <div 
          className="absolute h-8 w-3 bg-blue-500 rounded transition-all duration-300"
          style={{ left: `${getPosition(averageScore)}%` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Con (-1)</span>
        <span>Neutral (0)</span>
        <span>Pro (1)</span>
      </div>
      
      {/* Score display */}
      <div className="mt-4 text-center text-gray-700">
        <p className="font-medium">Current Score: {averageScore.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          (Claude: {claudeScore.toFixed(2)}, GPT: {gptScore.toFixed(2)})
        </p>
      </div>
    </div>
  );
};

export default DebateScoreVisualization; 