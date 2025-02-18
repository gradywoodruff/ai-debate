import React from 'react';

function PersuasionMeter({ scores, className = "" }) {
  const position = ((scores?.averageScore || 0) + 1) * 50; // Convert -1...1 to 0...100
  const claudePosition = ((scores?.claude?.score || 0) + 1) * 50;
  const gptPosition = ((scores?.gpt?.score || 0) + 1) * 50;

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Center marker */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-400" />
        
        {/* Individual AI score markers */}
        <div 
          className="absolute top-[-4px] h-3 w-0.5 bg-gray-400 opacity-50"
          style={{ left: `${claudePosition}%` }}
        />
        <div 
          className="absolute top-[-4px] h-3 w-0.5 bg-gray-400 opacity-50"
          style={{ left: `${gptPosition}%` }}
        />
        
        {/* Average score indicator */}
        <div 
          className="absolute top-0 h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ 
            left: '50%',
            width: `${Math.abs(position - 50)}%`,
            transform: `translateX(${position < 50 ? '0' : '-100'}%)`,
            backgroundColor: position < 50 ? '#ef4444' : '#3b82f6'
          }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-1 text-sm text-gray-600">
        <span>CON</span>
        <span>Neutral</span>
        <span>PRO</span>
      </div>
    </div>
  );
}

export default PersuasionMeter; 