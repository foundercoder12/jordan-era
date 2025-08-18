import { App } from '@slack/bolt';
import OpenAI from 'openai';
import cron from 'node-cron';
import moment from 'moment-timezone';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { MemoryClient } from 'mem0ai';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Load memory from file
function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const data = fs.readFileSync(MEMORY_FILE, 'utf8');
      return new Map(Object.entries(JSON.parse(data)));
    }
  } catch (error) {
    console.error('Error loading memory:', error);
  }
  return new Map();
}

// Initialize Slack app
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Start the application
try {
  // Start Express server first
  const server = app.listen(PORT, () => {
    console.log(`🌐 Express server running on port ${PORT}`);
  });

  // Verify server is running
  app.get('/', (req, res) => {
    res.status(200).send('Server is running');
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
  // Keep running for health checks
}
