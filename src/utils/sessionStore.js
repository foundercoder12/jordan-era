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

// Create a singleton store
class SessionStore {
  constructor() {
    this.sessions = new Map();
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      console.log('📖 Loading sessions from file:', MEMORY_FILE);
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
        this.sessions = new Map(Object.entries(parsed));
        console.log(`📚 Loaded ${this.sessions.size} sessions`);
      }
    } catch (error) {
      console.error('❌ Error loading sessions:', error);
      this.sessions = new Map();
    }
  }

  saveToDisk() {
    try {
      console.log('💾 Saving sessions to file');
      const data = Object.fromEntries(this.sessions);
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
      console.log(`✅ Saved ${this.sessions.size} sessions`);
    } catch (error) {
      console.error('❌ Error saving sessions:', error);
    }
  }

  createSession() {
    console.log('👤 Creating new session');
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

  get(userId) {
    let session = this.sessions.get(userId);
    if (!session) {
      session = this.createSession();
      this.sessions.set(userId, session);
    }
    return session;
  }

  set(userId, session) {
    this.sessions.set(userId, session);
    this.saveToDisk();
  }

  async getMemories(userId, limit = 10) {
    try {
      console.log('📖 Retrieving memories for user:', userId);
      const session = this.get(userId);
      
      // Ensure we have a valid conversation history
      const history = session.conversationHistory || [];
      
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

  async storeMemory(userId, userText, aiResponse) {
    try {
      console.log('💾 Storing memory for user:', userId);
      const session = this.get(userId);

      // Initialize conversation history if it doesn't exist
      if (!session.conversationHistory) {
        session.conversationHistory = [];
      }

      // Store the user's message
      if (userText) {
        session.conversationHistory.push({
          role: 'user',
          content: userText,
          timestamp: new Date()
        });
      }

      // Store the bot's response
      if (aiResponse) {
        session.conversationHistory.push({
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        });
      }

      // Keep last 20 messages for context
      if (session.conversationHistory.length > 20) {
        session.conversationHistory = session.conversationHistory.slice(-20);
      }

      // Update last interaction time and exchange count
      session.lastInteraction = new Date();
      session.exchangeCount = (session.exchangeCount || 0) + 1;

      // Save to disk
      this.saveToDisk();
      return true;
    } catch (error) {
      console.error('❌ Error storing memory:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const sessionStore = new SessionStore();
