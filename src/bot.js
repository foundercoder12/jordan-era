import { App } from '@slack/bolt';
import OpenAI from 'openai';
import cron from 'node-cron';
import moment from 'moment-timezone';
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { MJ_CHALLENGES, MEME_CONFIG, BOT_PERSONALITY, MEME_KEYWORDS } from './config/bot-config.js';
import { sendCalendarInviteEmail } from './utils/email.js';
import { loadMemory, saveMemory, createUserSession, storeMemory, retrieveMemories } from './utils/memory.js';

// Initialize environment variables
dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express server for healthchecks
const app = express();
const PORT = process.env.PORT || 3000;

// Load user sessions from persistent storage
const userSessions = loadMemory();

// Auto-save memory every 5 minutes
setInterval(() => saveMemory(userSessions), 5 * 60 * 1000);

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
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
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
