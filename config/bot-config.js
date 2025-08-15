// Bot Configuration
module.exports = {
  // Bot personality and behavior
  personality: {
    name: process.env.BOT_NAME || 'MotivationalFriend',
    tone: 'friendly, supportive, encouraging',
    maxResponseLength: 300,
    temperature: 0.8
  },

  // Scheduled reminder messages
  reminders: {
    morning: {
      time: process.env.MORNING_CHECK_IN || '09:00',
      message: `Good morning! 🌅 I'm here to help you have an amazing day! 

Let's start with a quick check-in:
1. What are you most excited to accomplish today?
2. What's your main goal or focus?
3. What might get in your way, and how can we work around it?

Share whatever feels right - I'm here to support you! 💪`
    },
    
    afternoon: {
      time: process.env.AFTERNOON_CHECK_IN || '14:00',
      message: `Hey there! ☀️ How's your day going so far? 

Let me know:
- Are you making progress on your goals?
- What's working well?
- What could use a little boost?

Remember, every step forward counts! 🚀`
    },
    
    evening: {
      time: process.env.EVENING_CHECK_IN || '18:00',
      message: `Evening check-in! 🌙 

Let's reflect on your day:
- What did you accomplish?
- What are you proud of?
- What would you like to improve tomorrow?

You're doing great! 🌟`
    },
    
    goodnight: {
      time: process.env.GOODNIGHT_REMINDER || '21:00',
      message: `Time to wind down! 😴 

Before you go:
- What's one thing you're grateful for today?
- What's one small win you had?
- What are you looking forward to tomorrow?

Sweet dreams! You've got this! 💫`
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
