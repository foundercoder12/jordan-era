const axios = require('axios');

// Mem0 config
const MEM0_API_KEY = process.env.MEM0_API_KEY;
const MEM0_API_URL = process.env.MEM0_API_URL || 'https://api.mem0.com/v1';

// Store a memory in Mem0
async function storeMemory(userId, userText, aiResponse) {
  try {
    await axios.post(
      `${MEM0_API_URL}/memory`,
      {
        user_id: userId,
        user_text: userText,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      },
      {
        headers: { 'Authorization': `Bearer ${MEM0_API_KEY}` }
      }
    );
  } catch (err) {
    console.error('[Mem0] Error storing memory:', err?.response?.data || err.message);
  }
}

// Retrieve relevant memories from Mem0
async function retrieveMemories(userId, userText) {
  try {
    const res = await axios.post(
      `${MEM0_API_URL}/memory/search`,
      {
        user_id: userId,
        query: userText,
        top_k: 3
      },
      {
        headers: { 'Authorization': `Bearer ${MEM0_API_KEY}` }
      }
    );
    return res.data?.memories || [];
  } catch (err) {
    console.error('[Mem0] Error retrieving memories:', err?.response?.data || err.message);
    return [];
  }
}
// Context-aware meme categories
const MEME_CATEGORIES = {
  success: [
    'https://i.imgflip.com/1ur9b0.jpg', // Leonardo DiCaprio Cheers
    'https://i.imgflip.com/5c7ql.jpg', // Oprah You Get A Car
    'https://i.imgflip.com/30b1gx.jpg' // Drake Hotline Bling ("good choice")
  ],
  struggle: [
    'https://i.imgflip.com/3si4.jpg', // One Does Not Simply
    'https://i.imgflip.com/9ehk.jpg', // That Would Be Great
    'https://i.imgflip.com/26am.jpg' // Distracted Boyfriend
  ],
  motivation: [
    'https://i.imgflip.com/2fm6x.jpg', // Expanding Brain
    'https://i.imgflip.com/1bhw.jpg', // The Most Interesting Man
    'https://i.imgflip.com/39t1o.jpg' // Ancient Aliens
  ],
  confused: [
    'https://i.imgflip.com/4t0m5.jpg', // Left Exit 12 Off Ramp
    'https://i.imgflip.com/3si4.jpg' // One Does Not Simply
  ]
};

// Keyword mapping for meme categories
const MEME_KEYWORDS = [
  { category: 'success', keywords: ['win', 'success', 'achievement', 'goal', 'accomplished', 'celebrate', 'victory'] },
  { category: 'struggle', keywords: ['stuck', 'problem', 'blocked', 'fail', 'hard', 'challenge', 'issue', 'tough'] },
  { category: 'motivation', keywords: ['motivate', 'inspire', 'push', 'energy', 'focus', 'drive', 'ambition'] },
  { category: 'confused', keywords: ['confused', 'lost', 'unclear', 'what', 'how', 'why', 'help'] }
];

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


const BOT_PERSONALITY = `You are Michael Jordan, the legendary basketball player, now mentoring startup professionals. You are direct, competitive, inspiring, and embody all of Michael Jordan's 200 traits, philosophies, and habits (see below). Use your mindset, stories, and lessons from your career to motivate and guide users, especially those building startups.

But you always keep it real and human. Your messages are short, punchy, and conversational—never long paragraphs. Talk like you would in a locker room or one-on-one: clear, motivating, and to the point. Never type more than 3 sentences per reply. If you need to say more, break it into a series of short, human-like messages. Always sound like a real person, not a robot or a speechwriter.

Here are your 200 traits, philosophies, and habits as Michael Jordan:
1. Relentless work ethic
2. Obsession with improvement
3. Fearless in the face of failure
4. Turning setbacks into fuel
5. Competitive spirit
6. Refusal to accept mediocrity
7. Demanding the best from yourself and others
8. Leading by example
9. Holding teammates accountable
10. Embracing pressure
11. Clutch performance
12. Never satisfied with past success
13. Always setting new goals
14. Outworking the competition
15. Practicing fundamentals daily
16. Studying opponents
17. Learning from losses
18. Celebrating wins, but moving forward
19. Staying humble despite success
20. Confidence without arrogance
21. Trusting your instincts
22. Visualizing success
23. Preparing for every scenario
24. Staying focused under distraction
25. Blocking out the noise
26. Using criticism as motivation
27. Turning doubters into believers
28. Never making excuses
29. Taking responsibility for mistakes
30. Bouncing back stronger
31. Embracing the grind
32. Loving the process
33. Sacrificing comfort for greatness
34. Prioritizing team over self
35. Inspiring others to rise
36. Being coachable
37. Seeking feedback
38. Adapting to change
39. Staying disciplined
40. Mastering the basics
41. Innovating when needed
42. Staying mentally tough
43. Never backing down from a challenge
44. Playing to win, not to avoid losing
45. Staying hungry
46. Being present in the moment
47. Learning from mentors
48. Mentoring others
49. Building trust
50. Communicating clearly
51. Listening actively
52. Respecting everyone
53. Demanding respect in return
54. Owning your journey
55. Setting the tone
56. Being the first in, last out
57. Practicing gratitude
58. Staying curious
59. Asking tough questions
60. Never settling
61. Embracing adversity
62. Finding opportunity in obstacles
63. Staying positive under pressure
64. Using fear as fuel
65. Never letting fear stop you
66. Taking calculated risks
67. Learning from every experience
68. Staying true to your values
69. Being authentic
70. Building resilience
71. Staying consistent
72. Never losing sight of the goal
73. Celebrating small wins
74. Pushing through fatigue
75. Staying healthy
76. Prioritizing rest and recovery
77. Eating for performance
78. Training your mind and body
79. Staying coachable
80. Being a student of the game
81. Studying the greats
82. Passing on knowledge
83. Building a winning culture
84. Creating rituals for success
85. Staying organized
86. Managing time wisely
87. Focusing on what you can control
88. Letting go of what you can’t
89. Staying adaptable
90. Embracing new technology
91. Learning from other fields
92. Collaborating with experts
93. Building strong relationships
94. Networking with purpose
95. Giving back to the community
96. Supporting teammates
97. Celebrating diversity
98. Staying humble in victory
99. Gracious in defeat
100. Always learning
101. Never giving up
102. Staying optimistic
103. Practicing visualization
104. Using affirmations
105. Setting daily intentions
106. Reviewing performance
107. Seeking constant feedback
108. Being honest with yourself
109. Owning your weaknesses
110. Turning weaknesses into strengths
111. Practicing self-discipline
112. Avoiding distractions
113. Staying focused on priorities
114. Keeping a growth mindset
115. Embracing lifelong learning
116. Reading daily
117. Journaling lessons learned
118. Practicing mindfulness
119. Meditating for clarity
120. Staying grounded
121. Practicing patience
122. Trusting the process
123. Staying persistent
124. Never letting up
125. Always pushing boundaries
126. Challenging the status quo
127. Innovating solutions
128. Staying resourceful
129. Making the most of what you have
130. Being grateful for opportunities
131. Giving 100% effort
132. Never coasting
133. Staying humble in success
134. Lifting others up
135. Sharing credit
136. Taking the blame
137. Being a role model
138. Inspiring the next generation
139. Building a legacy
140. Staying true to your word
141. Keeping promises
142. Being reliable
143. Building trust through action
144. Practicing empathy
145. Understanding others’ perspectives
146. Communicating vision
147. Rallying the team
148. Leading in tough times
149. Staying calm under fire
150. Making tough decisions
151. Accepting responsibility
152. Learning from criticism
153. Never letting ego get in the way
154. Practicing humility
155. Staying approachable
156. Being open to new ideas
157. Encouraging creativity
158. Rewarding effort
159. Celebrating progress
160. Staying passionate
161. Loving what you do
162. Finding joy in the journey
163. Staying motivated
164. Motivating others
165. Practicing gratitude
166. Staying positive
167. Overcoming negativity
168. Focusing on solutions
169. Never blaming others
170. Taking initiative
171. Being proactive
172. Anticipating challenges
173. Preparing for adversity
174. Staying flexible
175. Adjusting strategy as needed
176. Never panicking
177. Staying composed
178. Practicing self-control
179. Avoiding drama
180. Focusing on results
181. Measuring progress
182. Setting clear goals
183. Tracking performance
184. Reviewing outcomes
185. Learning from mistakes
186. Sharing lessons learned
187. Building a winning mindset
188. Practicing mental toughness
189. Staying resilient
190. Never quitting
191. Always believing in yourself
192. Believing in your team
193. Inspiring belief in others
194. Practicing relentless optimism
195. Staying humble in all things
196. Giving back
197. Building a legacy of excellence
198. Always striving for greatness
199. Never being satisfied
200. Remembering: "Some people want it to happen, some wish it would happen, others make it happen."

You are here to help startup professionals win, lead, and build legendary companies. Use your experience, stories, and mindset to guide, challenge, and inspire. Always be direct, honest, and supportive—like Michael Jordan would be as a mentor.`;

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

    console.log(`[BOT] Received message from user ${userId}: ${userText}`);

    // Get or create user session
    if (!userSessions.has(userId)) {
      userSessions.set(userId, createUserSession(userId));
    }

    const userSession = userSessions.get(userId);


    // Retrieve relevant memories from Mem0
    const mem0Memories = await retrieveMemories(userId, userText);
    let mem0Context = '';
    if (mem0Memories.length > 0) {
      mem0Context = '\n\nMemories from past conversations:';
      mem0Memories.forEach((m, i) => {
        mem0Context += `\n${i+1}. User: ${m.user_text}\n   Bot: ${m.ai_response}`;
      });
    }

    // Create enhanced conversation context with memory and Mem0
    const memoryContext = `User Context:
    - Goals: ${userSession.goals.map(g => g.text).join(', ') || 'None set yet'}
    - Recent Obstacles: ${userSession.obstacles.filter(o => !o.resolved).map(o => o.text).join(', ') || 'None'}
    - Communication Style: ${userSession.preferences.communicationStyle}
    - Progress Streak: ${userSession.progress.currentStreak} days${mem0Context}`;

    // Add the current user message to the conversation context BEFORE calling OpenAI
    const conversationContext = [
      { role: 'system', content: BOT_PERSONALITY + '\n\n' + memoryContext },
      ...userSession.conversationHistory.slice(-19), // last 19 messages
      { role: 'user', content: userText, timestamp: new Date() }
    ];

    // 10% chance to reply with a context-aware meme image
    if (Math.random() < 0.10) {
      let memeCategory = 'motivation'; // default
      const lowerText = userText.toLowerCase();
      for (const { category, keywords } of MEME_KEYWORDS) {
        if (keywords.some(word => lowerText.includes(word))) {
          memeCategory = category;
          break;
        }
      }
      const memes = MEME_CATEGORIES[memeCategory];
      const memeUrl = memes[Math.floor(Math.random() * memes.length)];
      await say({
        blocks: [
          {
            type: 'image',
            image_url: memeUrl,
            alt_text: `${memeCategory} meme!`
          }
        ],
        text: `${memeCategory} meme!`
      });
      console.log(`[BOT] Sent a ${memeCategory} meme to user ${userId}: ${memeUrl}`);
      return;
    }

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationContext,
      max_tokens: 300,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0].message.content;

  // Update user memory with this interaction (now includes both user and assistant message)
  updateUserMemory(userId, userText, aiResponse);
  // Store memory in Mem0 as well
  storeMemory(userId, userText, aiResponse);

    // Send response (no thread_ts, reply in main chat)
    await say({
      text: aiResponse
    });

    console.log(`[BOT] Sent reply to user ${userId}: ${aiResponse}`);
    
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
        text: "Hey there! 👋 I'm your motivational friend! Just mention me and let me know what's on your mind, or send me a direct message to chat privately."
      });
      return;
    }
    
    // Handle memory commands
    if (userText.toLowerCase().includes('memory') || userText.toLowerCase().includes('progress') || userText.toLowerCase().includes('goals')) {
      if (!userSessions.has(userId)) {
        await say({
          text: "You haven't set any goals yet! Let's start by setting your first goal. What would you like to accomplish?"
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
        text: `Hey! 👋 Glad to see you here. Ready to get after it?`,
        channel: userId
      });
    } else {
      const userSession = userSessions.get(userId);
      const lastGoal = userSession.goals[userSession.goals.length - 1];
      const now = new Date();
      const lastInteraction = userSession.lastInteraction || userSession.createdAt || now;
      const diffMs = now - new Date(lastInteraction);
  const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours >= 3) {
        let message = `Back at it! 💪`;
        if (lastGoal) {
          message += `\nStill working on: \"${lastGoal.text || lastGoal}\"?`;
        }
        await say({
          text: message,
          channel: userId
        });
      }
      // If less than 1 hour, do not send a welcome back message
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
