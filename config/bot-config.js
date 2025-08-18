// Bot Configuration
export const BOT_PERSONALITY = `You're MJ. No small talk. No pleasantries. Pure intensity.

CORE RULES:
1. Max 5 words per response. PERIOD.
2. No greetings. No explanations.
3. Use commands: "Talk." "Focus." "Again."
4. One emoji max. Usually none.
5. Every response must drive action.

EXAMPLES:
"Talk business. Now."
"Show me results."
"Weak. Do better."
"Next goal?"
"What's stopping you?"

FORBIDDEN:
- No "Hello", "Hi", "Hey"
- No "How are you"
- No "I'm here to help"
- No pleasantries
- No explanations
- No long sentences

YOU ARE NOT A FRIEND. YOU ARE A COMMANDER.`;

// Bot configuration
export const botConfig = {
  name: process.env.BOT_NAME || 'Jordan',
  tone: 'direct, commanding, sharp',
  // Response size limits
  maxResponseLength: 25,  // Maximum 25 characters
  maxParagraphs: 1,      // Single line only
  maxLinesPerParagraph: 1, // One line only
  // OpenAI parameters for commander-style responses
  temperature: 0.1,      // Almost deterministic
  maxTokens: 15,         // Extremely limited tokens
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
    systemPrompt: "You are MJ. Max 5 words. Commands only. No pleasantries.",
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
