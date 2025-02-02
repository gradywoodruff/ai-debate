const DEBATE_PROMPTS = {
  analyze: (topic) => `
    Analyze this debate topic: "${topic}"
     
    Please provide the following in JSON format:
    1. A concise, engaging title for the debate (4-8 words)
    2. A brief summary of the pro (supporting) stance (2-3 sentences)
    3. A brief summary of the con (opposing) stance (2-3 sentences)

    Format:
    {
      "title": "your title here",
      "proSummary": "pro stance summary",
      "conSummary": "con stance summary"
    }
  `,
  startDebate: (topic, role) => `
    Topic: "${topic}"

    You are arguing the ${role === 'pro' ? 'SUPPORTING (PRO)' : 'OPPOSING (CON)'} position.
    Present your opening argument. Keep it concise (2-3 paragraphs) and focus on strong, logical reasoning.

    Important: Provide your argument directly without any role labels or headers. Do not include prefixes like "PRO:" or "CON:" in your response.
  `,
  continueDebate: (topic, role, history) => {
    const formattedHistory = history.map(msg => {
      if (msg.role === 'moderator') {
        return `Moderator: ${msg.content}`;
      }
      return `${msg.role.toUpperCase()}: ${msg.content}`;
    }).join('\n\n');

    return `
      Topic: "${topic}"

      You are arguing the ${role === 'pro' ? 'SUPPORTING (PRO)' : 'OPPOSING (CON)'} position.

      Debate history:
      ${formattedHistory}

      Provide your next argument, addressing the points made by your opponent. Keep it concise (2-3 paragraphs) and maintain a respectful, logical tone.

      Important: Provide your argument directly without any role labels or headers. Do not include prefixes like "PRO:" or "CON:" or phrases like "Rebuttal and Counter-Argument" in your response. Start directly with your argument.
    `;
  }
};

module.exports = DEBATE_PROMPTS; 