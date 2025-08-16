// --- Gamification and Engagement Features ---

// Track user streaks and milestones
function updateStreak(userSession) {
  const today = new Date().toDateString();
  if (userSession.progress.lastGoalDate !== today) {
    userSession.progress.currentStreak += 1;
    userSession.progress.lastGoalDate = today;
    if (userSession.progress.currentStreak % 7 === 0) {
      userSession.progress.totalGoalsCompleted += 1;
      return '🏆 1-week streak! You’re on fire!';
    }
    if (userSession.progress.currentStreak % 30 === 0) {
      return '🏅 30-day streak! Legendary consistency!';
    }
    return '🔥 Streak updated! Keep going!';
  }
  return null;
}

// Daily/weekly challenge pool
const MJ_CHALLENGES = [
  "Do one thing today that scares you.",
  "Write down your biggest goal and one step to get closer.",
  "Give feedback to a teammate.",
  "Take a 5-minute break to visualize your success.",
  "Share a win in your team channel.",
  "Reflect on a recent failure and what you learned.",
  "Reach out to someone for advice or mentorship.",
  "Set a new personal best in something you do today."
];

function getRandomChallenge() {
  return MJ_CHALLENGES[Math.floor(Math.random() * MJ_CHALLENGES.length)];
}

// Feedback loop (send a message with Slack buttons)
async function sendFeedbackPrompt(say, userId) {
  await say({
    channel: userId,
    text: "How helpful was my last advice?",
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: "How helpful was my last advice?" }
      },
      {
        type: "actions",
        elements: [
          { type: "button", text: { type: "plain_text", text: "👍 Helpful" }, value: "helpful", action_id: "feedback_helpful" },
          { type: "button", text: { type: "plain_text", text: "👎 Not Helpful" }, value: "not_helpful", action_id: "feedback_not_helpful" }
        ]
      }
    ]
  });
}

// Social feature: share win in public channel
async function shareWin(say, userId, winText) {
  await say({
    channel: process.env.PUBLIC_CHANNEL_ID || "#general",
    text: `🎉 <@${userId}> just shared a win: ${winText}`
  });
}

// Leaderboard (stub, to be expanded)
async function postLeaderboard(say) {
  // This would aggregate stats and post to a channel
  await say({
    channel: process.env.PUBLIC_CHANNEL_ID || "#general",
    text: "🏅 Top performers this week: (feature coming soon!)"
  });
}

// 100+ short, real Michael Jordan scenarios, quotes, and lessons for inspiration
const MJ_GAME_SCENARIOS = [
// Keywords for context-aware scenario injection
// ...existing code...

// Place MJ scenario keywords and functions AFTER all require/import/config
  "I played through the 'Flu Game' in the 1997 Finals and still dropped 38 points. Sometimes you just push through.",
  "I got cut from my high school varsity team. I used that as fuel and came back stronger.",
  "I hit the game-winning shot in Game 6 of the 1993 Finals. Pressure is just an opportunity to shine.",
  "I missed over 9,000 shots in my career. Failure taught me more than success ever could.",
  "In 1989, I made 'The Shot' over Craig Ehlo. I always wanted the ball in clutch moments.",
  "I lost almost 300 games. Each loss made me hungrier.",
  "I failed over and over and over again in my life. That’s why I succeed.",
  "Championships are won in practice, not just on game day.",
  "I never looked at the consequences of missing a big shot. If you think about the consequences, you always think of a negative result.",
  "I always believed that if you put in the work, the results will come.",
  "Talent wins games, but teamwork and intelligence win championships.",
  "I can accept failure, everyone fails at something. But I can’t accept not trying.",
  "Obstacles don’t have to stop you. If you run into a wall, figure out how to climb it, go through it, or work around it.",
  "I never feared about my skills because I put in the work.",
  "I played every game like it was my last.",
  "I always wanted to be the best, and I was willing to work for it.",
  "I took every practice seriously. That’s where you build greatness.",
  "I respected my opponents, but I never feared them.",
  "I thrived on being doubted. Prove them wrong.",
  "I learned to love the grind. That’s where champions are made.",
  "I never let trash talk get in my head. I let my game do the talking.",
  "I played through pain. Champions don’t make excuses.",
  "I always wanted the ball in the clutch. Embrace the moment.",
  "I studied my opponents relentlessly. Preparation is key.",
  "I learned from every loss. Each one made me better.",
  "I never let success make me complacent. Stay hungry.",
  "I pushed my teammates to be their best. We win together.",
  "I was the first in the gym and the last to leave.",
  "I visualized success before every game.",
  "I played with a chip on my shoulder. Use doubt as fuel.",
  "I never let fear dictate my actions.",
  "I trusted my instincts in big moments.",
  "I always set new goals after every achievement.",
  "I learned more from my failures than my victories.",
  "I never stopped learning, even at the top.",
  "I respected the game and everyone who played it.",
  "I believed in my team, even when the odds were against us.",
  "I played for the love of the game, not just the trophies.",
  "I never let outside noise distract me from my mission.",
  "I practiced free throws until my hands hurt.",
  "I always looked for ways to improve, no matter how small.",
  "I played defense as hard as I played offense.",
  "I never let a bad quarter ruin my game.",
  "I learned to stay calm under pressure.",
  "I always gave credit to my teammates.",
  "I took responsibility for my mistakes.",
  "I never blamed others for my failures.",
  "I played with passion every night.",
  "I never let fatigue stop me from giving my all.",
  "I always believed the next shot would go in.",
  "I played through adversity and came out stronger.",
  "I never let a setback define me.",
  "I learned to adapt my game as I got older.",
  "I always stayed focused on the goal.",
  "I played for the fans as much as for myself.",
  "I never took a play off.",
  "I learned to trust my teammates.",
  "I always wanted to be remembered as a winner.",
  "I played with heart, not just skill.",
  "I never let the moment get too big.",
  "I learned to enjoy the journey, not just the destination.",
  "I always pushed myself to the limit.",
  "I played with confidence, not arrogance.",
  "I never let criticism break me.",
  "I learned to use my platform to inspire others.",
  "I always stayed humble, no matter the success.",
  "I played for something bigger than myself.",
  "I never let a bad game shake my belief.",
  "I learned to bounce back quickly from mistakes.",
  "I always kept my eyes on the prize.",
  "I played with intensity from tip-off to buzzer.",
  "I never let the crowd get in my head.",
  "I learned to block out distractions.",
  "I always stayed ready for the big moment.",
  "I played with a sense of urgency.",
  "I never let up, even with a lead.",
  "I learned to motivate myself when no one else would.",
  "I always believed in the power of preparation.",
  "I played with a relentless drive to win.",
  "I never let a loss linger.",
  "I learned to move on quickly.",
  "I always stayed true to my values.",
  "I played with respect for the game.",
  "I never let my ego get in the way.",
  "I learned to listen as much as I talked.",
  "I always looked for ways to help my team.",
  "I played with a sense of purpose.",
  "I never let a challenge go unanswered.",
  "I learned to embrace the grind.",
  "I always stayed positive, even in tough times.",
  "I played with a love for competition.",
  "I never let a bad call distract me.",
  "I learned to control what I could.",
  "I always gave my best, no matter the score.",
  "I played with a desire to be great.",
  "I never let up until the final buzzer.",
  "I learned to enjoy the process of improvement.",
  "I always stayed focused on the mission.",
  "I played with a chip on my shoulder.",
  "I never let anyone outwork me.",
  "I learned to appreciate the journey.",
  "I always believed in the power of hard work.",
  "I played with a relentless pursuit of excellence.",
  "I never let a setback stop my progress.",
  "I learned to turn adversity into opportunity.",
  "I always stayed committed to my goals.",
  "I played with a fearless attitude.",
  "I never let fear dictate my actions.",
  "I learned to trust the process.",
  "I always stayed hungry for more.",
  "I played with a winner’s mentality.",
  "I never let success make me complacent.",
  "I learned to keep pushing, no matter what."
];

function maybeAddMJScenario(userText, aiResponse) {
  if (shouldAddMJScenario(userText, aiResponse)) {
    const scenario = MJ_GAME_SCENARIOS[Math.floor(Math.random() * MJ_GAME_SCENARIOS.length)];
    // If the response is long, add scenario as a new line; if short, append naturally
    if (aiResponse.length > 180) {
      return aiResponse + '\n' + scenario;
    } else {
      return aiResponse + ' ' + scenario;
    }
  }
  return aiResponse;
}
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

// Keywords for context-aware scenario injection (must be after require/config)
const MJ_SCENARIO_KEYWORDS = [
  'struggle', 'stuck', 'hard', 'challenge', 'fail', 'failure', 'mistake', 'loss', 'losing',
  'motivate', 'motivation', 'inspire', 'energy', 'push', 'drive', 'ambition',
  'pressure', 'stress', 'clutch', 'big moment', 'finals', 'buzzer',
  'win', 'winning', 'victory', 'champion', 'success', 'trophy',
  'advice', 'help', 'tip', 'suggest', 'recommend', 'guidance'
];

function shouldAddMJScenario(userText, aiResponse) {
  const text = (userText + ' ' + aiResponse).toLowerCase();
  return MJ_SCENARIO_KEYWORDS.some(word => text.includes(word));
}

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

// Memory utilities
const MEMORY_FILE = path.join(__dirname, 'user_memory.json');

// Load memory from file
function loadMemory() {

// Enhanced user memory system
const userSessions = loadMemory();
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

    // Update streak and celebrate milestones
    const streakMsg = updateStreak(userSession);
    if (streakMsg) {
      await say({ text: streakMsg });
    }

    // Occasionally send a challenge
    if (Math.random() < 0.08) {
      await say({ text: `MJ Challenge: ${getRandomChallenge()}` });
    }

    // Occasionally ask for feedback
    if (Math.random() < 0.05) {
      await sendFeedbackPrompt(say, userId);
    }

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

    // Optionally add a short, real MJ scenario for a more human feel, only if it fits the context
    const finalResponse = maybeAddMJScenario(userText, aiResponse);

    // Update user memory with this interaction (now includes both user and assistant message)
    updateUserMemory(userId, userText, finalResponse);
    // Store memory in Mem0 as well
    storeMemory(userId, userText, finalResponse);

    // Send response (no thread_ts, reply in main chat)
    await say({
      text: finalResponse
    });

    console.log(`[BOT] Sent reply to user ${userId}: ${finalResponse}`);
    
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
