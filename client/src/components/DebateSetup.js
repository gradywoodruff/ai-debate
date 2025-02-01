import React, { useState } from 'react';

function DebateSetup({ onStart }) {
  const [topic, setTopic] = useState('');
  const [proAI, setProAI] = useState('claude');
  const [conAI, setConAI] = useState('gpt');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ topic, proAI, conAI });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Set Up AI Debate</h2>
      
      <input
        required
        placeholder="Debate Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-sm text-gray-600">For</label>
          <select
            value={proAI}
            onChange={(e) => setProAI(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="claude">Claude</option>
            <option value="gpt">GPT-4</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-600">Against</label>
          <select
            value={conAI}
            onChange={(e) => setConAI(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="claude">Claude</option>
            <option value="gpt">GPT-4</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!topic}
        className={`
          px-6 py-3 rounded-lg text-lg
          bg-purple-600 text-white
          hover:bg-purple-400
          disabled:bg-purple-300
          transition-colors
        `}
      >
        Start Debate
      </button>
    </form>
  );
}

export default DebateSetup; 