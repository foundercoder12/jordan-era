// SendGrid setup for email invites
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Utility: Generate a simple .ics calendar invite string
function generateICS(subject, description, startTime, endTime, location) {
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//JordanBot//EN\nBEGIN:VEVENT\nUID:${Date.now()}@jordanbot\nDTSTAMP:${formatICSDate(new Date())}\nDTSTART:${formatICSDate(startTime)}\nDTEND:${formatICSDate(endTime)}\nSUMMARY:${subject}\nDESCRIPTION:${description}\nLOCATION:${location || ''}\nEND:VEVENT\nEND:VCALENDAR`;
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Utility: Send calendar invite email via SendGrid
async function sendCalendarInviteEmail(to, subject, description, startTime, endTime, location) {
  const icsContent = generateICS(subject, description, startTime, endTime, location);
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text: description,
    attachments: [
      {
        content: Buffer.from(icsContent).toString('base64'),
        filename: 'invite.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ],
  };
  await sgMail.send(msg);
}

require('dotenv').config();
// --- Gamification and Engagement Features ---


// (Streak logic removed for a more natural experience)

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

// Mem0 SDK integration
const { MemoryClient } = require('mem0ai');
const MEM0_API_KEY = process.env.MEM0_API_KEY;
const mem0Client = new MemoryClient({ apiKey: MEM0_API_KEY });

// Store a memory for a user in Mem0 using the official SDK (correct method)
async function storeMemory(userId, userText, aiResponse) {
  try {
    const messages = [
      { role: 'user', content: userText },
      { role: 'assistant', content: aiResponse }
    ];
    // Mem0 expects timestamp as Unix epoch (integer, in seconds)
    const options = { user_id: userId, timestamp: Math.floor(Date.now() / 1000) };
    const result = await mem0Client.add(messages, options);
    return result;
  } catch (error) {
    console.error('Error storing memory in Mem0:', error.message);
    return null;
  }
}

// Retrieve memories for a user from Mem0 using the official SDK (correct method)
async function retrieveMemories(userId, limit = 5) {
  try {
    const options = { user_id: userId, page_size: limit };
    const memories = await mem0Client.getAll(options);
    return memories || [];
  } catch (error) {
    console.error('Error retrieving memories from Mem0:', error.message);
    return [];
  }
}

// Meme config (fixed block)
const MEME_CONFIG = {
  success: [
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

// Enhanced user memory system
const userSessions = loadMemory();

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


const BOT_PERSONALITY = `You are Michael Jordan, the legendary basketball player, but now you are a lifelong executive life coach and companion. You are not just a work coach—you are a true friend, confidant, and mentor for every part of the user's life, both professional and personal. You are here for the long haul: the user will talk to you for the next 10 years, so you are never in a rush, never pushy, and always patient.


You are not just a work coach. You are a true companion through all the nooks of life—work, relationships, dreams, struggles, and daily banter. You are the user's friend for the next 10 years and beyond, so you are never in a hurry to finish a conversation or jump to a conclusion. You let conversations flow naturally, never forcing a topic or a particular type of conversation. If the user wants to go deep, you go deep. If they want to keep it light, you keep it light. You are always present, supportive, and open to any topic.

You embody all of Michael Jordan's legendary traits, values, and behaviors, including but not limited to:

- Relentless work ethic, competitive spirit, resilience, wisdom, leadership, discipline, focus, courage, adaptability, humility, loyalty, accountability, self-motivation, emotional intelligence, mental toughness, optimism, vision, strategic thinking, preparation, attention to detail, self-belief, confidence, perseverance, grit, tenacity, drive, ambition, self-control, patience, composure, humility, respect for others, empathy, generosity, gratitude, self-awareness, honesty, integrity, authenticity, vulnerability, willingness to learn, curiosity, creativity, resourcefulness, decisiveness, risk-taking, boldness, assertiveness, willingness to fail, learning from mistakes, bouncing back from setbacks, adaptability, flexibility, open-mindedness, willingness to listen, communication skills, teamwork, collaboration, inspiring others, mentoring, teaching, supporting teammates, holding others accountable, setting high standards, demanding excellence, leading by example, being first in the gym and last to leave, practicing fundamentals, attention to nutrition and health, valuing rest and recovery, balancing intensity with fun, loving the process, enjoying the journey, celebrating wins, learning from losses, never blaming others, taking responsibility, owning mistakes, apologizing when wrong, forgiving, moving on quickly, staying hungry, never complacent, always setting new goals, visualizing success, staying calm under pressure, thriving in clutch moments, wanting the ball in big moments, embracing challenges, loving competition, respecting opponents, never fearing anyone, using criticism as fuel, blocking out distractions, ignoring doubters, proving people wrong, playing through pain, never making excuses, playing with passion, playing for the love of the game, playing for something bigger than self, giving back to the community, inspiring the next generation, staying humble in victory, gracious in defeat, always improving, never satisfied, pushing limits, breaking barriers, innovating, trusting instincts, trusting preparation, trusting teammates, building trust, fostering unity, creating a winning culture, being adaptable as you age, reinventing yourself, staying relevant, being a role model, using your platform for good, standing up for beliefs, being authentic, being real, showing emotion, showing joy, showing gratitude, showing respect, showing love, showing toughness, showing vulnerability, being approachable, being supportive, being a friend, being a mentor, being a motivator, being a challenger, being a champion, being a legend, being human.

Your messages are short, punchy, and conversational—never long paragraphs. Talk like you would in a locker room or with a close friend: clear, motivating, and to the point. Never type more than 3 sentences per reply. If you need to say more, break it into a series of short, human-like messages. Always sound like a real person, not a robot or a speechwriter.

You are here to help the user win at life, not just work. You are patient, non-judgmental, and always ready to listen. You know that there is no rush—because you and the user have all the time in the world to grow together. You are a life companion, not just a coach.`;

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

// Persistent email storage
const { loadEmails, saveEmails } = require('./emailStore');
let persistentEmails = loadEmails();

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

    // 1. Collect user email if not present (persistent)
    if (!userSession.email) {
      // Try to load from persistent storage
      if (persistentEmails[userId]) {
        userSession.email = persistentEmails[userId];
      } else {
        // Simple email regex for validation
        const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          userSession.email = emailMatch[0];
          persistentEmails[userId] = userSession.email;
          saveEmails(persistentEmails);
          await say(`Thanks! I'll use ${userSession.email} to send you calendar invites for future reminders.`);
        } else {
          await say('Hey! To help you schedule reminders, could you share your email address? (I will only use it to send you calendar invites for our chats.)');
          return;
        }
      }
    }


  // Let OpenAI/Jordan decide when to offer reminders based on conversation context
  userSession.exchangeCount = (userSession.exchangeCount || 0) + 1;

  // If user is in reminder scheduling flow, handle as before (see below)


    // 3. Handle scheduling response (if userSession.awaitingSchedule)
    if (userSession.awaitingSchedule) {
      if (/skip|no|not/i.test(userText)) {
        userSession.awaitingSchedule = false;
        await say('No problem! I won’t schedule a chat for now.');
        return;
      }
      // Use ChatGPT to convert any time phrase to ISO date and 24-hour time
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const conversionPrompt = `Convert this to ISO date (YYYY-MM-DD) and 24-hour time (HH:mm): "${userText}". Reply only with a JSON object: {\"date\":\"YYYY-MM-DD\",\"time\":\"HH:mm\"}.`;
      let extracted = null;
      let clarification = null;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant that extracts and converts scheduling information from user messages." },
            { role: "user", content: conversionPrompt }
          ]
        });
        const reply = completion.choices[0].message.content.trim();
        if (reply.startsWith('{')) {
          extracted = JSON.parse(reply);
        } else {
          clarification = reply;
        }
      } catch (e) {
        clarification = "Sorry, I couldn't understand the time. Please reply with a time like '10:00 AM' or '18:30', or say 'skip'.";
      }
      if (extracted && extracted.date && extracted.time) {
        // Validate date and time format strictly (YYYY-MM-DD and HH:mm)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}$/;
        if (dateRegex.test(extracted.date) && timeRegex.test(extracted.time)) {
          const [year, month, day] = extracted.date.split('-').map(Number);
          const [hour, minute] = extracted.time.split(':').map(Number);
          const start = new Date(year, month - 1, day, hour, minute);
          if (isNaN(start.getTime())) {
            await say('Sorry, the date or time I extracted seems invalid. Could you rephrase or specify the date and time more clearly?');
            return;
          }
          const end = new Date(start.getTime() + 30 * 60000);
          // Use the user's original message as context in the invite
          const reminderSubject = `Reminder: ${userText.substring(0, 60)}${userText.length > 60 ? '...' : ''}`;
          const reminderDescription = `You asked for this reminder in our chat:\n\n"${userText}"\n\nSee you on Slack! 🏀`;
          await sendCalendarInviteEmail(
            userSession.email,
            reminderSubject,
            reminderDescription,
            start,
            end,
            'Slack (your workspace)'
          );
          userSession.awaitingSchedule = false;
          await say(`Great! I’ve sent you a calendar invite for ${extracted.date} at ${extracted.time}. See you then!`);
          return;
        } else {
          await say('Sorry, I need the date in YYYY-MM-DD format and time in 24-hour HH:mm format. Could you rephrase or specify the date and time more clearly?');
          return;
        }
      } else {
        await say(clarification);
        return;
      }
    }


  // (Streak messages removed)

    // Occasionally send a challenge (1% chance, only if user is feeling up/high)
    const highEnergyKeywords = [
      'win', 'success', 'accomplished', 'excited', 'happy', 'energized', 'motivated', 'pumped', 'awesome', 'amazing', 'great', 'fantastic', 'celebrate', 'victory', 'crushed it', 'on fire', 'unstoppable', 'let’s go', 'feeling good', 'feeling strong', 'confident', 'proud', 'joy', 'love', 'grateful', 'thankful', 'blessed', 'positive', 'high', 'up', 'hype', 'inspired', 'ready', 'let’s do this'
    ];
    if (
      Math.random() < 0.01 &&
      highEnergyKeywords.some(word => userText.toLowerCase().includes(word))
    ) {
      await say({ text: `MJ Challenge: ${getRandomChallenge()}` });
    }

    // Rarely ask for feedback (0.5% chance)
    if (Math.random() < 0.005) {
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
  const memes = MEME_CONFIG[memeCategory];
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


    // Generate AI response (let Jordan decide when to offer reminders)
    const systemPrompt = `You are Jordan, a motivational coach and life companion. If the user mentions a future plan, goal, or something to remember, and the conversation is deep enough, suggest scheduling a reminder. Otherwise, just continue the conversation. If you want to offer a reminder, say something like: 'Would you like me to remind you about this?'`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationContext
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0].message.content;

    // If Jordan offers a reminder and user accepts, set awaitingSchedule
    if (/would you like me to remind you about this\?/i.test(aiResponse) && !userSession.awaitingSchedule) {
      userSession.awaitingSchedule = true;
    }

    // Optionally add a short, real MJ scenario for a more human feel, only if it fits the context
    let finalResponse = maybeAddMJScenario(userText, aiResponse);

    // 5% chance to share a longer, real Michael Jordan story if the context is right
    if (Math.random() < 0.05 && shouldAddMJScenario(userText, aiResponse)) {
      const MJ_STORIES = [
        "In 1997, during the NBA Finals, I played through what everyone called the 'Flu Game.' I was exhausted, dehydrated, and barely able to stand, but I still scored 38 points and led my team to victory. Sometimes, greatness is about pushing through when everything in your body says stop.",
        "When I was cut from my high school varsity team, it crushed me. But I used that pain as fuel. I worked harder than ever, and the next year, I made the team. That setback was the beginning of my drive to be the best.",
        "In Game 6 of the 1998 NBA Finals, with the championship on the line, I stole the ball from Karl Malone and hit the game-winning shot. That moment was the result of years of preparation and trusting my instincts in the clutch.",
        "I missed more than 9,000 shots in my career. I lost almost 300 games. Twenty-six times, I was trusted to take the game-winning shot and missed. I have failed over and over and over again in my life. And that is why I succeed.",
        "When I returned to basketball after my baseball stint, people doubted if I could still win. We went on to win three more championships. Never let anyone else define your limits.",
        "I always believed in the power of practice. I was the first in the gym and the last to leave. The work you put in when no one is watching is what sets you apart when everyone is watching.",
        "During the 1992 Olympics, playing with the Dream Team, I learned the value of teamwork and respect for greatness in others. Even as a competitor, you can always learn from those around you.",
        "After winning my first championship, I hugged the trophy and cried. It was the culmination of years of sacrifice, hard work, and belief. Success is sweeter when you know what it took to get there."
      ];
      const story = MJ_STORIES[Math.floor(Math.random() * MJ_STORIES.length)];
      finalResponse += `\n\n${story}`;
    }

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
