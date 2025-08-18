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

import { botConfig, MJ_CHALLENGES, MEME_CONFIG, BOT_PERSONALITY, MEME_KEYWORDS } from './config/bot-config.js';
import { sendCalendarInviteEmail } from './utils/email.js';
import { sessionStore } from './utils/sessionStore.js';

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

// Initialize health check endpoint first
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      sessions: sessionStore.sessions.size,
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
  // Skip bot messages
  if (message.subtype === 'bot_message') return;

  console.log('📨 Received message:', {
    text: message.text,
    user: message.user,
    channel: message.channel,
    timestamp: message.ts
  });

  try {
    console.log('🤔 Processing message...');
    // Get user session or create new one
    const userSession = sessionStore.get(message.user);

    // Check for email in the message
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = message.text.match(emailRegex);
    if (emailMatch) {
      userSession.email = emailMatch[0];
      await say(`Thanks! I'll use ${userSession.email} for calendar invites. What time would you like to schedule our chat?`);
      userSession.awaitingSchedule = true;
      return;
    }

    // If we're awaiting schedule and have email
    if (userSession.awaitingSchedule && userSession.email) {
      try {
        // Try to parse time from message
        const timeMatch = message.text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (timeMatch) {
          let [_, hours, minutes = '00', meridian] = timeMatch;
          hours = parseInt(hours);
          if (meridian && meridian.toLowerCase() === 'pm' && hours < 12) hours += 12;
          if (meridian && meridian.toLowerCase() === 'am' && hours === 12) hours = 0;

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(hours, parseInt(minutes), 0, 0);

          const endTime = new Date(tomorrow);
          endTime.setHours(endTime.getHours() + 1);

          await sendCalendarInviteEmail(
            userSession.email,
            'Chat with Jordan - Your AI Coach',
            'A meaningful conversation about work and life with your AI coach Jordan.',
            tomorrow,
            endTime,
            'Slack'
          );

          userSession.awaitingSchedule = false;
          await say(`Perfect! I've sent a calendar invite to ${userSession.email} for tomorrow at ${hours}:${minutes.padStart(2, '0')}. Looking forward to our chat!`);
          return;
        } else {
          await say("I'm having trouble understanding the time. Could you specify it in a format like '11:00 am' or '14:00'?");
          return;
        }
      } catch (error) {
        console.error('Error scheduling:', error);
        await say("I had trouble scheduling that. Could you try specifying the time again?");
        return;
      }
    }

    // Get conversation history
    const memories = await sessionStore.getMemories(message.user);
    console.log('📝 Retrieved memories:', memories.length);
    
    // Create enhanced conversation context with memory
    const memoryContext = `User Context:
    - Goals: ${userSession.goals?.map(g => g.text).join(', ') || 'None set yet'}
    - Recent Obstacles: ${userSession.obstacles?.filter(o => !o.resolved).map(o => o.text).join(', ') || 'None'}
    - Progress Streak: ${userSession.progress?.currentStreak || 0} days`;

    console.log('🧠 Generating response with OpenAI...');
    
    // Convert memories to valid OpenAI messages
    const memoryMessages = memories
        .filter(m => m && m.content) // Filter out null or invalid memories
        .map(m => ({
            role: m.role || "assistant",
            content: m.content || m.response || ""
        }))
        .filter(m => m.content); // Final check for valid content

    const messages = [
        { 
            role: "system", 
            content: `${BOT_PERSONALITY}\n\n${memoryContext}`
        },
        ...memoryMessages,
        { 
            role: "user", 
            content: message.text 
        }
    ];

    console.log('📤 Sending messages to OpenAI:', messages.length);
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: botConfig.openai.temperature,
        max_tokens: botConfig.openai.maxTokens,
        presence_penalty: botConfig.openai.presencePenalty,
        frequency_penalty: botConfig.openai.frequencyPenalty
    });

    const response = completion.choices[0].message.content;
    console.log('💬 Sending response:', response);
    
    // Store the interaction
    await sessionStore.storeMemory(message.user, message.text, response);
    
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
