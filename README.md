# 🤖 Motivational Slack Bot

A friendly AI-powered Slack bot that acts like a supportive friend, helping you set daily goals, stay motivated, and overcome obstacles throughout your day.

## ✨ Features

- **Friendly AI Personality**: Powered by OpenAI GPT-4o-mini with a warm, supportive friend personality
- **Daily Goal Setting**: Helps you define what you want to accomplish each day
- **Obstacle Identification**: Helps identify and work through challenges
- **Scheduled Reminders**: Automatic check-ins throughout the day:
  - 🌅 Morning motivation (9:00 AM)
  - ☀️ Afternoon check-in (2:00 PM)
  - 🌙 Evening reflection (6:00 PM)
  - 😴 Goodnight motivation (9:00 PM)
- **Personalized Conversations**: Remembers your goals and conversation history
- **Direct Messages & Mentions**: Chat privately or mention the bot in channels

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the environment template and fill in your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token
SLACK_SIGNING_SECRET=your-actual-signing-secret
SLACK_APP_TOKEN=xapp-your-actual-app-token

# OpenAI Configuration
OPENAI_API_KEY=your-actual-openai-api-key

# Bot Configuration
BOT_NAME=MotivationalFriend
DEFAULT_CHANNEL=general
TIMEZONE=America/New_York
```

### 3. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give it a name (e.g., "Motivational Friend Bot")
4. Select your workspace

### 4. Configure Slack App Permissions

#### Bot Token Scopes (OAuth & Permissions):
- `chat:write` - Send messages
- `app_mentions:read` - Read mentions
- `channels:read` - Read channel info
- `im:read` - Read direct messages
- `im:write` - Send direct messages
- `app_home:read` - Read app home
- `app_home:write` - Write to app home

#### Event Subscriptions:
- `app_mention` - When someone mentions your app
- `app_home_opened` - When someone opens your app's home
- `message.im` - When someone sends a direct message

#### Socket Mode:
- Enable Socket Mode and note the App-Level Token

### 5. Install App to Workspace

1. Go to "Install App" in the sidebar
2. Click "Install to Workspace"
3. Copy the Bot User OAuth Token (starts with `xoxb-`)

### 6. Run the Bot

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 💬 How to Use

### Direct Messages
Send the bot a direct message to start a private conversation:
- "What should I focus on today?"
- "I'm feeling stuck with my project"
- "How can I stay motivated?"

### Channel Mentions
Mention the bot in any channel:
- "@MotivationalFriend I need help planning my day"
- "@MotivationalFriend I accomplished something great!"

### Scheduled Reminders
The bot automatically sends motivational messages at:
- **9:00 AM**: Morning goal-setting and motivation
- **2:00 PM**: Afternoon progress check-in
- **6:00 PM**: Evening reflection and celebration
- **9:00 PM**: Goodnight gratitude and tomorrow's focus

## 🔧 Configuration

### Customizing Reminder Times
Edit the `.env` file to change reminder times:

```env
MORNING_CHECK_IN=08:30
AFTERNOON_CHECK_IN=13:00
EVENING_CHECK_IN=17:30
GOODNIGHT_REMINDER=22:00
```

### Changing Timezone
Update the `TIMEZONE` in your `.env` file:

```env
TIMEZONE=Europe/London
TIMEZONE=Asia/Tokyo
TIMEZONE=Pacific/Auckland
```

### Bot Personality
The bot's personality is defined in the `BOT_PERSONALITY` constant in `src/bot.js`. You can customize it to match your preferred tone and style.

## 🏗️ Architecture

- **Slack Bolt Framework**: Handles Slack API interactions
- **OpenAI GPT-4o-mini**: Powers the conversational AI
- **Node-cron**: Manages scheduled reminders
- **In-memory Storage**: Maintains user sessions and conversation history
- **Socket Mode**: Enables real-time communication with Slack

## 📁 Project Structure

```
slack-motivational-bot/
├── src/
│   └── bot.js          # Main bot logic
├── .env                 # Environment variables (create from env.example)
├── env.example         # Environment template
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🚨 Troubleshooting

### Common Issues

1. **Bot not responding**: Check your Slack app permissions and token
2. **Scheduled messages not working**: Verify your timezone setting
3. **OpenAI errors**: Ensure your API key is valid and has credits
4. **Socket mode issues**: Check your app-level token

### Logs
The bot logs important events to the console. Look for:
- `🚀 Motivational Slack Bot is running!`
- `⏰ Scheduled reminders are active`
- `🤖 Bot is ready to motivate and support!`

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this bot for your team or organization.

## 🎯 Example Conversations

**User**: "I want to finish my project today but I'm feeling overwhelmed"

**Bot**: "I totally get that feeling! 😊 Let's break this down together. What's the one thing you could do in the next hour that would make the biggest difference? Sometimes starting small is the key to building momentum. What do you think?"

**User**: "I'm procrastinating on starting"

**Bot**: "Ah, the classic procrastination trap! 🪤 Here's what I know - the hardest part is often just beginning. What if you committed to just 5 minutes? Set a timer, work for 5 minutes, and then you can stop if you want. But I bet once you start, you'll want to keep going! What do you say to trying the 5-minute rule?"

---

**Ready to get motivated? Start chatting with your new AI friend! 🚀**
