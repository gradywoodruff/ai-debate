const axios = require("axios")
const Anthropic = require("@anthropic-ai/sdk")
const DEBATE_PROMPTS = require("../constants/prompts")

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const startDebate = async (topic, currentAI, firstSpeaker) => {
  try {
    console.log("Making API request with:", { topic, currentAI, firstSpeaker })

    if (currentAI === "gpt") {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "user", content: DEBATE_PROMPTS.startDebate(topic, firstSpeaker) }
          ],
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      )

      return {
        message: response.data.choices[0].message.content,
        ai: currentAI
      }
    } else {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          { role: "user", content: DEBATE_PROMPTS.startDebate(topic, firstSpeaker) }
        ]
      })

      return {
        message: response.content[0].text,
        ai: currentAI
      }
    }
  } catch (error) {
    console.error("Error in startDebate:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}

const continueDebate = async (topic, history, currentAI) => {
  try {
    const lastDebateMessage = [...history].reverse().find(m => m.role !== "moderator")
    const nextRole = lastDebateMessage?.role === "pro" ? "con" : "pro"

    let response
    if (currentAI === "gpt") {
      response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: DEBATE_PROMPTS.continueDebate(topic, nextRole, history)
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      )

      // Get the new message content
      const newMessage = response.data.choices[0].message.content

      // Find the last messages from each side
      const lastProResponse = [...history, { role: nextRole, content: newMessage }]
        .filter(m => m.role === "pro")
        .pop()?.content

      const lastConResponse = [...history, { role: nextRole, content: newMessage }]
        .filter(m => m.role === "con")
        .pop()?.content

      if (lastProResponse && lastConResponse) {
        const scores = await getPersuasivenessScores(
          topic,
          history,
          lastProResponse,
          lastConResponse
        )
        return {
          message: newMessage,
          ai: currentAI,
          scores
        }
      }

      return {
        message: newMessage,
        ai: currentAI
      }
    } else {
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: DEBATE_PROMPTS.continueDebate(topic, nextRole, history)
          }
        ]
      })

      // Get the new message content
      const newMessage = response.content[0].text

      // Find the last messages from each side
      const lastProResponse = [...history, { role: nextRole, content: newMessage }]
        .filter(m => m.role === "pro")
        .pop()?.content

      const lastConResponse = [...history, { role: nextRole, content: newMessage }]
        .filter(m => m.role === "con")
        .pop()?.content

      if (lastProResponse && lastConResponse) {
        const scores = await getPersuasivenessScores(
          topic,
          history,
          lastProResponse,
          lastConResponse
        )
        return {
          message: newMessage,
          ai: currentAI,
          scores
        }
      }

      return {
        message: newMessage,
        ai: currentAI
      }
    }
  } catch (error) {
    console.error("Error in continueDebate:", error)
    throw error
  }
}

const detectConsensus = async (topic, history) => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
            Analyze this debate history and determine if the participants have reached any points of agreement or consensus.
            Look for:
            1. Shared premises
            2. Acknowledged valid points from the opponent
            3. Areas where positions have evolved or merged
            4. Potential compromise positions

            If you detect meaningful consensus, suggest a synthesis position that both sides might accept.
            If no consensus is detected, explain the core disagreements that remain.

            Format as JSON:
            {
              "consensusDetected": boolean,
              "sharedPremises": [...],
              "remainingDisagreements": [...],
              "possibleSynthesis": "..." || null,
              "recommendedOutcome": "CONTINUE|CONCLUDE",
              "explanation": "..."
            }
          `
        }
      ]
    })

    return JSON.parse(response.content[0].text)
  } catch (error) {
    console.error("Error in detectConsensus:", error)
    throw error
  }
}

const evaluateResponse = async (topic, currentResponse, previousResponse) => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: DEBATE_PROMPTS.evaluateResponse(
            topic,
            currentResponse,
            previousResponse
          )
        }
      ]
    })

    return JSON.parse(response.content[0].text)
  } catch (error) {
    console.error("Error in evaluateResponse:", error)
    throw error
  }
}

const checkDebateProgress = async (topic, history, scores) => {
  try {
    // Check for convergence
    const convergence = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      messages: [
        {
          role: "user",
          content: DEBATE_PROMPTS.checkConvergence(topic, history)
        }
      ]
    })

    const convergenceData = JSON.parse(convergence.content[0].text)

    // If high convergence or enough rounds, generate summary
    if (convergenceData.convergenceScore > 75 || history.length >= 10) {
      const summary = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        messages: [
          {
            role: "user",
            content: DEBATE_PROMPTS.generateSummary(topic, history, scores)
          }
        ]
      })

      return {
        shouldConclude: true,
        convergence: convergenceData,
        summary: JSON.parse(summary.content[0].text)
      }
    }

    return {
      shouldConclude: false,
      convergence: convergenceData
    }
  } catch (error) {
    console.error("Error in checkDebateProgress:", error)
    throw error
  }
}

const getPersuasivenessScores = async (
  topic,
  history,
  lastProResponse,
  lastConResponse
) => {
  try {
    // Get Claude's score
    const claudeResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: DEBATE_PROMPTS.scorePersuasiveness(
            topic,
            history,
            lastProResponse,
            lastConResponse
          )
        }
      ]
    })

    // Get GPT's score
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: DEBATE_PROMPTS.scorePersuasiveness(
              topic,
              history,
              lastProResponse,
              lastConResponse
            )
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const claudeScore = JSON.parse(claudeResponse.content[0].text)
    const gptScore = JSON.parse(gptResponse.data.choices[0].message.content)

    return {
      claude: claudeScore,
      gpt: gptScore,
      averageScore: (claudeScore.score + gptScore.score) / 2
    }
  } catch (error) {
    console.error("Error getting persuasiveness scores:", error)
    throw error
  }
}

module.exports = {
  startDebate,
  continueDebate,
  detectConsensus,
  evaluateResponse,
  checkDebateProgress,
  getPersuasivenessScores
}
