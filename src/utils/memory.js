import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Memory utilities
const MEMORY_FILE = join(__dirname, '..', '..', 'data', 'user_memory.json');

// Ensure data directory exists
const dataDir = join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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

export function createUserSession() {
  return {
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
    createdAt: new Date(),
    exchangeCount: 0
  };
}

// Simplified memory storage without mem0ai
export async function storeMemory(userId, userText, aiResponse) {
  try {
    const userSessions = loadMemory();
    const session = userSessions.get(userId) || createUserSession(userId);
    
    // Initialize conversation history if it doesn't exist
    if (!userSession.conversationHistory) {
      userSession.conversationHistory = [];
    }

    // Store the user's message
    if (userText) {
      userSession.conversationHistory.push({
        role: 'user',
        content: userText,
        timestamp: new Date()
      });
    }

    // Store the bot's response
    if (aiResponse) {
      userSession.conversationHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });
    }
    
    // Keep only last 100 messages
    if (session.conversationHistory.length > 100) {
      session.conversationHistory = session.conversationHistory.slice(-100);
    }
    
    userSessions.set(userId, session);
    saveMemory(userSessions);
    return true;
  } catch (error) {
    console.error('Error storing memory:', error);
    return false;
  }
}

export async function retrieveMemories(userId, limit = 10) {
  try {
    console.log('📖 Retrieving memories for user:', userId);
    const userSession = userSessions.get(userId);
    if (!userSession) {
      console.log('⚠️ No user session found');
      return [];
    }

    // Ensure we have a valid conversation history
    const history = userSession.conversationHistory || [];
    
    // Filter out any invalid entries and ensure required fields
    const validMemories = history
      .filter(m => m && (m.content || m.response)) // Must have either content or response
      .map(m => ({
        role: m.role || 'assistant',
        content: m.content || m.response,
        timestamp: m.timestamp || new Date()
      }))
      .slice(-limit); // Get only the most recent ones

    console.log(`📚 Found ${validMemories.length} valid memories`);
    return validMemories;
  } catch (error) {
    console.error('❌ Error retrieving memories:', error);
    return [];
  }
}
