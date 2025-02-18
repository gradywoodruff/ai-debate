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
  },
  evaluateDebate: (topic, history) => `
    As an impartial debate judge, evaluate this debate on "${topic}" using the following criteria:

    1. Logical Reasoning (1-10):
    - Validity of arguments
    - Use of evidence
    - Clear cause-and-effect relationships

    2. Rhetorical Effectiveness (1-10):
    - Persuasiveness
    - Clarity of expression
    - Emotional appeal

    3. Rebuttal Quality (1-10):
    - Direct addressing of opponent's points
    - Counter-argument strength
    - Adaptation to new information

    4. Overall Impact (1-10):
    - Contribution to understanding
    - Memorable points
    - Changed perspectives

    Please provide:
    1. Numerical scores for each category for both PRO and CON
    2. A brief explanation for each score
    3. A final winner determination (PRO, CON, or DRAW)
    4. A 2-3 sentence summary of why the winner was chosen

    Format your response as JSON:
    {
      "pro": {
        "logical": { "score": X, "explanation": "..." },
        "rhetorical": { "score": X, "explanation": "..." },
        "rebuttal": { "score": X, "explanation": "..." },
        "impact": { "score": X, "explanation": "..." }
      },
      "con": {
        "logical": { "score": X, "explanation": "..." },
        "rhetorical": { "score": X, "explanation": "..." },
        "rebuttal": { "score": X, "explanation": "..." },
        "impact": { "score": X, "explanation": "..." }
      },
      "winner": "PRO|CON|DRAW",
      "reasoning": "..."
    }
  `,
  evaluateResponse: (topic, currentResponse, previousResponse) => `
    Evaluate this debate response on "${topic}" using the following criteria.
    Provide a score (1-10) and brief explanation for each:

    1. Argument Strength
    - Evidence quality
    - Logical consistency
    - Originality of points
    
    2. Rebuttal Quality
    - How well it addresses previous arguments
    - Counter-evidence provided
    - Identification of logical flaws

    3. Discourse Quality
    - Clarity of expression
    - Civility/professionalism
    - Persuasiveness

    Format as JSON:
    {
      "scores": {
        "argument": { "score": X, "reason": "..." },
        "rebuttal": { "score": X, "reason": "..." },
        "discourse": { "score": X, "reason": "..." }
      },
      "novelPoints": ["..."],
      "recommendedFollowup": "..."
    }
  `,
  checkConvergence: (topic, history) => `
    Analyze this debate history for signs of convergence or potential resolution.
    Consider:
    1. Shared premises between participants
    2. Acknowledged valid points from opponents
    3. Evolution of positions
    4. Areas of potential compromise

    Format as JSON:
    {
      "convergenceScore": X, // 0-100
      "sharedPremises": ["..."],
      "potentialCompromises": ["..."],
      "remainingDisagreements": ["..."],
      "recommendedAction": "CONTINUE|CONCLUDE",
      "synthesisPosition": "..." // potential compromise position
    }
  `,
  generateSummary: (topic, history, scores) => `
    Generate a final summary of this debate on "${topic}".
    Include:
    1. Key arguments from both sides
    2. Points of agreement/disagreement
    3. Overall quality of discourse
    4. Final conclusion/recommendation

    Use the provided scoring history to support your analysis.
    Focus on being objective and highlighting the strongest points from each side.

    Format as JSON:
    {
      "summary": "...",
      "keyArguments": {
        "pro": ["..."],
        "con": ["..."]
      },
      "consensus": {
        "agreements": ["..."],
        "disagreements": ["..."]
      },
      "conclusion": "...",
      "winner": "PRO|CON|DRAW",
      "explanation": "..."
    }
  `,
  scorePersuasiveness: (topic, history, lastProResponse, lastConResponse) => `
    You are evaluating the persuasiveness of arguments in a debate on: "${topic}"

    Rate the overall persuasiveness of the arguments on a scale from -1 to 1 where:
    -1 = Completely convinced by CON (opposing) position
     0 = Neutral/equally persuaded by both sides
    +1 = Completely convinced by PRO (supporting) position

    Consider:
    1. Strength of evidence and reasoning
    2. Effectiveness of rebuttals
    3. Clarity and impact of arguments
    4. Overall coherence of position

    Most recent arguments:
    PRO: ${lastProResponse}
    CON: ${lastConResponse}

    Previous debate context:
    ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}

    Format response as JSON:
    {
      "score": X,  // number between -1 and 1
      "reasoning": "Brief explanation of score...",
      "proStrengths": ["..."],
      "conStrengths": ["..."]
    }
  `
};

module.exports = DEBATE_PROMPTS; 