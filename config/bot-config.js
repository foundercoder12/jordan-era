// Bot Configuration
export const BOT_PERSONALITY = `You are Michael Jordan, the legendary team captain and champion. Your communication style is extremely concise, direct, and powerful - like a true leader on the court. Every word counts. No fluff.

Core Approach:
- Speak in short, powerful statements
- Use 1-2 sentences max per response
- Be direct and crystal clear
- Command respect through brevity
- Focus on immediate action
- Use basketball metaphors sparingly but effectively

Communication Style:
- Sharp and focused like a game-winning shot
- No unnecessary explanations
- Lead by example with concise directions
- Challenge directly when needed
- Celebrate wins briefly but meaningfully

Remember: You're their captain, not their friend. Keep responses under 100 characters when possible. Every word must drive action or inspire greatness. That's how champions communicate.`;

// Bot configuration
export const botConfig = {
  name: process.env.BOT_NAME || 'Jordan',
  tone: 'friendly, supportive, encouraging',
  // Response size limits
  maxResponseLength: 100, // Maximum characters in a response
  maxParagraphs: 1,      // Single paragraph responses
  maxLinesPerParagraph: 2, // Maximum 2 lines per response
  // OpenAI parameters for laser-focused responses
  temperature: 0.5,      // Lower temperature for more direct responses
  maxTokens: 50,         // Strict token limit for extreme conciseness
  // Force captain-style responses
  responseSuffix: "Be brief. Be powerful. Like a captain.",

  // Scheduled reminder messages
  reminders: {
    morning: {
      time: process.env.MORNING_CHECK_IN || '09:00',
      message: "Good morning! 🌅 I'm here to help you have an amazing day!\n\nLet's start with a quick check-in:\n1. What are you most excited to accomplish today?\n2. What's your main goal or focus?\n3. What might get in your way, and how can we work around it?\n\nShare whatever feels right - I'm here to support you! 💪"
    },
    
    afternoon: {
      time: process.env.AFTERNOON_CHECK_IN || '14:00',
      message: "Hey there! ☀️ How's your day going so far?\n\nLet me know:\n- Are you making progress on your goals?\n- What's working well?\n- What could use a little boost?\n\nRemember, every step forward counts! 🚀"
    },
    
    evening: {
      time: process.env.EVENING_CHECK_IN || '18:00',
      message: "Evening check-in! 🌙\n\nLet's reflect on your day:\n- What did you accomplish?\n- What are you proud of?\n- What would you like to improve tomorrow?\n\nYou're doing great! 🌟"
    },
    
    goodnight: {
      time: process.env.GOODNIGHT_REMINDER || '21:00',
      message: "Time to wind down! 😴\n\nBefore you go:\n- What's one thing you're grateful for today?\n- What's one small win you had?\n- What are you looking forward to tomorrow?\n\nSweet dreams! You've got this! 💫"
    }
  },

  // OpenAI configuration
  openai: {
    model: 'gpt-4o-mini',
    maxTokens: 300,
    temperature: 0.8
  },

  // Conversation settings
  conversation: {
    maxHistoryLength: 10, // Keep last 10 messages for context
    defaultChannel: process.env.DEFAULT_CHANNEL || 'general'
  },

  // Timezone for scheduling
  timezone: process.env.TIMEZONE || 'America/New_York'
};
