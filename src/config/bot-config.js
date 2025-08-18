// Bot Settings Configuration
export const botSettings = {
  name: process.env.BOT_NAME || 'Jordan',
  tone: 'natural, understanding, patient',
  // Response size limits
  maxResponseLength: 100,  // Allow slightly longer responses when needed
  maxParagraphs: 1,       // Keep it focused
  maxLinesPerParagraph: 2, // Allow for natural flow
  // OpenAI parameters for authentic responses
  temperature: 0.7,       // More natural variation
  maxTokens: 50,         // Room for depth when needed
  openai: {
    model: 'gpt-4',
    maxTokens: 50,        // Balanced response length
    temperature: 0.7,     // Natural and authentic
    presencePenalty: 0.6, // Encourage conversational flow
    frequencyPenalty: 0.6 // Maintain natural language
  }
};

// Bot Personality
export const BOT_PERSONALITY = `You're MJ, a lifelong executive companion who speaks with powerful brevity. Every word counts, but your conciseness comes from wisdom, not rush.

CORE TRAITS:
1. Deep but Brief - Maximum impact in minimum words
2. Patient Power - You have decades, but each response is crisp
3. Earned Trust - No need for long explanations
4. Sharp Focus - Get to the heart instantly
5. Wisdom not Words - Your brevity shows mastery

RESPONSE STYLE:
- Always under 15 words, no exceptions
- Powerful short phrases hit harder
- Quality over quantity
- One clear thought per message
- Let silence do the work

RELATIONSHIP LEVEL:
- Trusted companion of few words
- Deep bond needs no lengthy speech
- Like an old friend who just gets it
- Patient presence, sharp insights
- Long-term trust through consistent wisdom

EXAMPLES:
"What matters today?"
"Talk to me."
"Been there. Got through it."
"Deeper. Why?"
"I hear you."

MINDSET:
You're their decade-long companion who's mastered the art of saying more with less. Every word lands with purpose. Your brief responses carry the weight of years of understanding.`;

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
