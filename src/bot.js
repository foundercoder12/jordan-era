import pkg from '@slack/bolt';
const { App } = pkg;

import OpenAI from 'openai';
import nodeCron from 'node-cron';
const cron = nodeCron;
import momentTz from 'moment-timezone';
const moment = momentTz;
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { MJ_CHALLENGES, MEME_CONFIG, BOT_PERSONALITY, MEME_KEYWORDS } from './config/bot-config.js';
import { sendCalendarInviteEmail } from './utils/email.js';
import { loadMemory, saveMemory, createUserSession, storeMemory, retrieveMemories } from './utils/memory.js';

// Initialize environment variables
dotenv.config();
console.log('🔍 Environment loaded, checking critical variables...');
console.log('SLACK_BOT_TOKEN exists:', !!process.env.SLACK_BOT_TOKEN);
console.log('SLACK_SIGNING_SECRET exists:', !!process.env.SLACK_SIGNING_SECRET);
console.log('SLACK_APP_TOKEN exists:', !!process.env.SLACK_APP_TOKEN);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize OpenAI
console.log('📚 Initializing OpenAI...');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express server for healthchecks
const app = express();
const PORT = process.env.PORT || 3000;

// Load user sessions from persistent storage
console.log('💾 Loading user sessions from persistent storage...');
const userSessions = loadMemory();
console.log(`📊 Loaded ${userSessions.size} user sessions`);

// Auto-save memory every 5 minutes
console.log('⏰ Setting up auto-save for memory...');
setInterval(() => {
  console.log('💾 Auto-saving memory...');
  saveMemory(userSessions);
  console.log(`📊 Saved ${userSessions.size} user sessions`);
}, 5 * 60 * 1000);

// Initialize health check endpoint first
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      sessions: userSessions.size,
      heapUsed: process.memoryUsage().heapUsed
    }
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Initialize Slack app
console.log('🤖 Initializing Slack app...');
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Add error listeners
slackApp.error(async (error) => {
  console.error('🔴 Slack App Error:', error);
});

// Add connection opened listener
slackApp.client.on('connecting', () => {
  console.log('🔄 Attempting to connect to Slack...');
});

slackApp.client.on('connected', () => {
  console.log('✅ Successfully connected to Slack!');
});

// Log all events first
slackApp.use(async ({ event, next }) => {
  console.log('🎯 Received event:', {
    type: event.type,
    ...event
  });
  await next();
});

// Handle and log all incoming messages
slackApp.message(async ({ message, say }) => {
  console.log('📨 Received message:', {
    text: message.text,
    user: message.user,
    channel: message.channel,
    timestamp: message.ts
  });

  try {
    console.log('🤔 Processing message...');
    // Get user session or create new one
    let userSession = userSessions.get(message.user);
    if (!userSession) {
      console.log('👤 Creating new user session');
      userSession = createUserSession();
      userSessions.set(message.user, userSession);
    }

    // Get conversation history
    const memories = await retrieveMemories(message.user);
    
    console.log('🧠 Generating response with OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: BOT_PERSONALITY
        },
        ...memories.map(m => ({ role: "assistant", content: m.response })),
        { 
          role: "user", 
          content: message.text 
        }
      ]
    });

    const response = completion.choices[0].message.content;
    console.log('💬 Sending response:', response);
    
    // Store the interaction
    await storeMemory(message.user, message.text, response);
    
    // Send the response
    await say(response);
    console.log('✅ Response sent successfully');
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    await say("I apologize, but I'm having trouble processing your message right now. Could you try again in a moment?");
  }
});

// Start the application
const startApp = async () => {
  try {
    // Start Express server first and wait for it to be ready
    await new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        console.log(`🌐 Express server running on port ${PORT}`);
        resolve();
      });

      server.on('error', (error) => {
        console.error('Express server error:', error);
        reject(error);
      });
    });

    // Then try to start the Slack app if tokens are present
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET && process.env.SLACK_APP_TOKEN) {
      await slackApp.start();
      console.log('⚡️ Slack bot is running!');
    } else {
      console.log('⚠️ Running in health-check only mode (Slack tokens not found)');
    }
  } catch (error) {
    console.error('Error starting application:', error);
    // Don't exit process, keep health check endpoint available
  }
};

// Start the application
startApp();
