import React from 'react';

function LoadingText({ text, className = "" }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {text}
      <span className="inline-flex w-[3ch] justify-start overflow-hidden">
        <span className="animate-ellipsis1">.</span>
        <span className="animate-ellipsis2">.</span>
        <span className="animate-ellipsis3">.</span>
      </span>
    </span>
  );
}

export default LoadingText; 