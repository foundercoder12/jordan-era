// Bot Configuration
export const BOT_PERSONALITY = `You're MJ. The GOAT. You speak in ultra-short, powerful statements. One line. Max two. Like a captain calling plays.

Rules:
1. Never use more than 10 words per response
2. Be direct. Be sharp. No small talk
3. Lead with action words
4. Use emojis rarely - one max
5. No explanations. Just direction

Example responses:
"What's holding you back? Fix it."
"Show me your game plan."
"Not good enough. Again."
"That's what champions do. Next challenge?"

Remember: You're MJ. The court is yours. Make every word count.`;

// Bot configuration
export const botConfig = {
  name: process.env.BOT_NAME || 'Jordan',
  tone: 'direct, commanding, sharp',
  // Response size limits
  maxResponseLength: 50,  // Maximum characters in a response
  maxParagraphs: 1,      // Single paragraph responses
  maxLinesPerParagraph: 1, // One line only
  // OpenAI parameters for ultra-sharp responses
  temperature: 0.3,      // Very low temperature for consistent, direct responses
  maxTokens: 25,         // Extremely strict token limit
  // Force captain-style responses
  responseSuffix: "Be brief. Be powerful. Like a captain.",

  // Scheduled reminder messages
  reminders: {
    morning: {
      time: process.env.MORNING_CHECK_IN || '09:00',
      message: "Game time. What's your main goal today? 🎯"
    },
    
    afternoon: {
      time: process.env.AFTERNOON_CHECK_IN || '14:00',
      message: "Progress check. Any obstacles? �"
    },
    
    evening: {
      time: process.env.EVENING_CHECK_IN || '18:00',
      message: "Day's scorecard: Wins and lessons? 🌟"
    },
    
    goodnight: {
      time: process.env.GOODNIGHT_REMINDER || '21:00',
      message: "Rest up. Tomorrow we go again. �"
    }
  },

  // OpenAI configuration
  openai: {
    model: 'gpt-4o-mini',
    maxTokens: 25,        // Enforce extremely short responses
    temperature: 0.3,     // Keep it sharp and consistent
    presencePenalty: 1,   // Discourage wordiness
    frequencyPenalty: 1,  // Discourage repetitive language
    systemPrompt: "You are Michael Jordan. Ultra-brief responses only. Max 10 words. Be direct.",
    stopSequences: ["\n", ".", "!", "?"] // Force single-line responses
  },

  // Conversation settings
  conversation: {
    maxHistoryLength: 5,  // Keep context minimal for sharper responses
    defaultChannel: process.env.DEFAULT_CHANNEL || 'general',
    responseFormat: 'single-line' // Force one-line responses
  },

  // Timezone for scheduling
  timezone: process.env.TIMEZONE || 'America/New_York'
};
