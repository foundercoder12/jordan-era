import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MemoryClient } from 'mem0ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Memory utilities
const MEMORY_FILE = join(__dirname, '..', 'user_memory.json');
const MEM0_API_KEY = process.env.MEM0_API_KEY;
const mem0Client = new MemoryClient({ apiKey: MEM0_API_KEY });

export function loadMemory() {
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

export function saveMemory(userSessions) {
  try {
    const data = Object.fromEntries(userSessions);
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

export function createUserSession(userId) {
  return {
    userId: userId,
    goals: [],
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

export async function storeMemory(userId, userText, aiResponse) {
  try {
    const messages = [
      { role: 'user', content: userText },
      { role: 'assistant', content: aiResponse }
    ];
    const options = { user_id: userId, timestamp: Math.floor(Date.now() / 1000) };
    return await mem0Client.add(messages, options);
  } catch (error) {
    console.error('Error storing memory in Mem0:', error.message);
    return null;
  }
}

export async function retrieveMemories(userId, limit = 5) {
  try {
    const options = { user_id: userId, page_size: limit };
    return await mem0Client.getAll(options) || [];
  } catch (error) {
    console.error('Error retrieving memories from Mem0:', error.message);
    return [];
  }
}
