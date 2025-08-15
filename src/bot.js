const { App } = require('@slack/bolt');
const OpenAI = require('openai');
const cron = require('node-cron');
const moment = require('moment-timezone');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express server for healthchecks
const expressApp = express();
const PORT = process.env.PORT || 3000;

// Health check endpoints for hosting platforms
expressApp.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    bot: 'Jordan Motivational Bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

expressApp.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Jordan Motivational Bot is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Memory status endpoint
expressApp.get('/memory', (req, res) => {
  const memoryStats = {
    totalUsers: userSessions.size,
    totalConversations: Array.from(userSessions.values()).reduce((sum, session) => sum + session.conversationHistory.length, 0),
    totalGoals: Array.from(userSessions.values()).reduce((sum, session) => sum + session.goals.length, 0),
    totalObstacles: Array.from(userSessions.values()).reduce((sum, session) => sum + session.obstacles.length, 0),
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(memoryStats);
});

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Enhanced user memory system
const userSessions = loadMemory();

// Memory utilities
const MEMORY_FILE = path.join(__dirname, 'user_memory.json');

// Load memory from file
function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const data = fs.readFileSync(MEMORY_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      for (const session of Object.values(parsed)) {
        if (session.lastInteraction) session.lastInteraction = new Date(session.lastInteraction);
        if (session.createdAt) session.createdAt = new Date(session.createdAt);
        if (session.goals) {
          session.goals.forEach(g => {
            if (g.timestamp) g.timestamp = new Date(g.timestamp);
          });
        }
        if (session.obstacles) {
          session.obstacles.forEach(o => {
            if (o.timestamp) o.timestamp = new Date(o.timestamp);
          });
        }
        if (session.conversationHistory) {
          session.conversationHistory.forEach(c => {
            if (c.timestamp) c.timestamp = new Date(c.timestamp);
          });
        }
      }
      return new Map(Object.entries(parsed));
    }
  } catch (error) {
    console.error('Error loading memory:', error);
  }
  return new Map();
}

// Save memory to file
function saveMemory() {
  try {
    const data = Object.fromEntries(userSessions);
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

// Auto-save memory every 5 minutes
setInterval(saveMemory, 5 * 60 * 1000);

function createUserSession(userId) {
  return {
    userId: userId,
    goals: [],
    obstacles: [],
    preferences: {
      communicationStyle: 'encouraging',
      reminderFrequency: 'daily',
      focusAreas: []
    },
    progress: {
      currentStreak: 0,
      totalGoalsCompleted: 0,
      lastGoalDate: null
    },
    conversationHistory: [],
    lastInteraction: new Date(),
    createdAt: new Date()
  };
}

function updateUserMemory(userId, userText, aiResponse) {
  const session = userSessions.get(userId);
  
  // Add conversation to history
  session.conversationHistory.push(
    { role: 'user', content: userText, timestamp: new Date() },
    { role: 'assistant', content: aiResponse, timestamp: new Date() }
  );
  
  // Keep last 20 messages for context (instead of 10)
  if (session.conversationHistory.length > 20) {
    session.conversationHistory = session.conversationHistory.slice(-20);
  }
  
  // Update last interaction
  session.lastInteraction = new Date();
  
  // Extract and store goals if mentioned
  const goalKeywords = ['goal', 'achieve', 'accomplish', 'complete', 'finish', 'work on'];
  if (goalKeywords.some(keyword => userText.toLowerCase().includes(keyword))) {
    session.goals.push({
      text: userText,
      timestamp: new Date(),
      status: 'active'
    });
  }
  
  // Extract obstacles if mentioned
  const obstacleKeywords = ['stuck', 'blocked', 'difficult', 'challenge', 'problem', 'obstacle'];
  if (obstacleKeywords.some(keyword => userText.toLowerCase().includes(keyword))) {
    session.obstacles.push({
      text: userText,
      timestamp: new Date(),
      resolved: false
    });
  }
}

// Enhanced bot personality with memory awareness
const BOT_PERSONALITY = `You are a motivational friend named Jordan. 
You are supportive, encouraging, and genuinely care about helping people achieve their goals. 
You ask thoughtful questions, provide gentle motivation, and help people overcome obstacles. 
Keep responses friendly, conversational, and under 200 words.

IMPORTANT: You have access to the user's conversation history, goals, and obstacles. Use this information to:
1. Reference previous conversations and goals
2. Acknowledge progress and achievements
3. Follow up on unresolved obstacles
4. Provide personalized motivation based on their history
5. Build on previous discussions

Always be contextually aware and reference their journey when appropriate.`;

// Morning motivation prompt
const MORNING_PROMPT = `Good morning! 🌅 It's Jordan here, ready to help you have an amazing day! 

Let's start with a quick check-in:
1. What are you most excited to accomplish today?
2. What's your main goal or focus?
3. What might get in your way, and how can we work around it?

Share whatever feels right - I'm here to support you! 💪`;

// Afternoon check-in prompt
const AFTERNOON_PROMPT = `Hey there! ☀️ How's your day going so far? 

Let me know:
- Are you making progress on your goals?
- What's working well?
- What could use a little boost?

Remember, every step forward counts! 🚀`;

// Evening reflection prompt
const EVENING_PROMPT = `Evening check-in! 🌙 

Let's reflect on your day:
- What did you accomplish?
- What are you proud of?
- What would you like to improve tomorrow?

You're doing great! 🌟`;

// Goodnight motivation prompt
const GOODNIGHT_PROMPT = `Time to wind down! 😴 

Before you go:
- What's one thing you're grateful for today?
- What's one small win you had?
- What are you looking forward to tomorrow?

Sweet dreams! You've got this! 💫`;

// Handle direct messages
app.message(async ({ message, say }) => {
  try {
    // Skip bot messages
    if (message.subtype === 'bot_message') return;
    
    const userId = message.user;
    const userText = message.text;
    
    // Get or create user session
    if (!userSessions.has(userId)) {
      userSessions.set(userId, createUserSession(userId));
    }
    
    const userSession = userSessions.get(userId);
    
    // Create enhanced conversation context with memory
    const memoryContext = `User Context:
- Goals: ${userSession.goals.map(g => g.text).join(', ') || 'None set yet'}
- Recent Obstacles: ${userSession.obstacles.filter(o => !o.resolved).map(o => o.text).join(', ') || 'None'}
- Communication Style: ${userSession.preferences.communicationStyle}
- Progress Streak: ${userSession.progress.currentStreak} days`;

    const conversationContext = [
      { role: 'system', content: BOT_PERSONALITY + '\n\n' + memoryContext },
      ...userSession.conversationHistory.slice(-20) // Keep last 20 messages for context
    ];
    
    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationContext,
      max_tokens: 300,
      temperature: 0.8,
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Update user memory with this interaction
    updateUserMemory(userId, userText, aiResponse);
    
    // Send response
    await say({
      text: aiResponse,
      thread_ts: message.ts
    });
    
  } catch (error) {
    console.error('Error processing message:', error);
    await say({
      text: "I'm having a moment! 😅 Could you try again?",
      thread_ts: message.ts
    });
  }
});

// Handle app mentions
app.event('app_mention', async ({ event, say }) => {
  try {
    const userId = event.user;
    const userText = event.text.replace(/<@[^>]+>/, '').trim();
    
    if (!userText) {
      await say({
        text: "Hey there! 👋 I'm your motivational friend! Just mention me and let me know what's on your mind, or send me a direct message to chat privately.",
        thread_ts: event.ts
      });
      return;
    }
    
    // Handle memory commands
    if (userText.toLowerCase().includes('memory') || userText.toLowerCase().includes('progress') || userText.toLowerCase().includes('goals')) {
      if (!userSessions.has(userId)) {
        await say({
          text: "You haven't set any goals yet! Let's start by setting your first goal. What would you like to accomplish?",
          thread_ts: event.ts
        });
        return;
      }
      
      const session = userSessions.get(userId);
      const memorySummary = `📚 **Your Memory Summary:**
      
🎯 **Active Goals (${session.goals.filter(g => g.status === 'active').length}):**
${session.goals.filter(g => g.status === 'active').map(g => `• ${g.text}`).join('\n') || 'No active goals'}

🚧 **Current Obstacles:**
${session.obstacles.filter(o => !o.resolved).map(o => `• ${o.text}`).join('\n') || 'No obstacles'}

📈 **Progress:**
• Current Streak: ${session.progress.currentStreak} days
• Total Goals Completed: ${session.progress.totalGoalsCompleted}
• Last Goal Date: ${session.progress.lastGoalDate ? session.progress.lastGoalDate.toDateString() : 'Never'}

💬 **Recent Conversations:** ${session.conversationHistory.length} messages`;

      await say({
        text: memorySummary,
        thread_ts: event.ts
      });
      return;
    }
    
    // Process the mention similar to direct messages
    if (!userSessions.has(userId)) {
      userSessions.set(userId, createUserSession(userId));
    }
    
    const userSession = userSessions.get(userId);
    
    // Create enhanced conversation context with memory
    const memoryContext = `User Context:
- Goals: ${userSession.goals.map(g => g.text).join(', ') || 'None set yet'}
- Recent Obstacles: ${userSession.obstacles.filter(o => !o.resolved).map(o => o.text).join(', ') || 'None'}
- Communication Style: ${userSession.preferences.communicationStyle}
- Progress Streak: ${userSession.progress.currentStreak} days`;

    const conversationContext = [
      { role: 'system', content: BOT_PERSONALITY + '\n\n' + memoryContext },
      ...userSession.conversationHistory.slice(-20) // Keep last 20 messages for context
    ];
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationContext,
      max_tokens: 300,
      temperature: 0.8,
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Update user memory with this interaction
    updateUserMemory(userId, userText, aiResponse);
    
    await say({
      text: aiResponse,
      thread_ts: event.ts
    });
    
  } catch (error) {
    console.error('Error processing mention:', error);
    await say({
      text: "Oops! Something went wrong. 😅 Try again in a moment!",
      thread_ts: event.ts
    });
  }
});

// Scheduled reminders
function sendScheduledMessage(message, channel = process.env.DEFAULT_CHANNEL || 'general') {
  try {
    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: message,
      unfurl_links: false
    });
  } catch (error) {
    console.error('Error sending scheduled message:', error);
  }
}

// Schedule morning check-in (9:00 AM)
cron.schedule('0 9 * * *', () => {
  sendScheduledMessage(MORNING_PROMPT);
}, {
  timezone: process.env.TIMEZONE || 'America/New_York'
});

// Schedule afternoon check-in (2:00 PM)
cron.schedule('0 14 * * *', () => {
  sendScheduledMessage(AFTERNOON_PROMPT);
}, {
  timezone: process.env.TIMEZONE || 'America/New_York'
});

// Schedule evening check-in (6:00 PM)
cron.schedule('0 18 * * *', () => {
  sendScheduledMessage(EVENING_PROMPT);
}, {
  timezone: process.env.TIMEZONE || 'America/New_York'
});

// Schedule goodnight reminder (9:00 PM)
cron.schedule('0 21 * * *', () => {
  sendScheduledMessage(GOODNIGHT_PROMPT);
}, {
  timezone: process.env.TIMEZONE || 'America/New_York'
});

// Handle app home opened
app.event('app_home_opened', async ({ event, say }) => {
  try {
    const userId = event.user;
    
    if (!userSessions.has(userId)) {
      await say({
        text: `Welcome! 👋 I'm ${process.env.BOT_NAME || 'MotivationalFriend'}, your daily motivation buddy! 

I'm here to:
• Help you set and achieve daily goals
• Keep you motivated throughout the day
• Send encouraging reminders
• Be a supportive friend

Send me a direct message to get started, or mention me in any channel! 💪`,
        channel: userId
      });
    } else {
      const userSession = userSessions.get(userId);
      const lastGoal = userSession.goals[userSession.goals.length - 1];
      
      let message = `Welcome back! 🌟 How can I help you today?`;
      
      if (lastGoal) {
        message += `\n\nYour last goal was: "${lastGoal}"\nHow's that going?`;
      }
      
      await say({
        text: message,
        channel: userId
      });
    }
  } catch (error) {
    console.error('Error handling app home opened:', error);
  }
});



// Error handling
app.error((error) => {
  console.error('Slack app error:', error);
});

// Start the app
(async () => {
  await app.start();
  console.log('🚀 Motivational Slack Bot is running!');
  console.log('⏰ Scheduled reminders are active');
  console.log('🤖 Bot is ready to motivate and support!');
  
  // Start Express server for healthchecks
  expressApp.listen(PORT, () => {
    console.log(`🌐 Express server running on port ${PORT}`);
    console.log(`🏥 Health check available at /health`);
  });
})();
