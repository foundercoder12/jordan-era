# 🚀 Quick Setup Guide

## ⚡ Get Your Motivational Bot Running in 5 Minutes

### 1. 📋 Copy Environment File
```bash
cp env.example .env
```

### 2. 🔑 Get Your API Keys

#### OpenAI API Key:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login and go to API Keys
3. Create a new secret key
4. Copy it to your `.env` file

#### Slack App Setup:
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name: "Motivational Friend Bot"
4. Select your workspace

### 3. ⚙️ Configure Slack App

#### Bot Token Scopes (OAuth & Permissions):
- `chat:write`
- `app_mentions:read`
- `channels:read`
- `im:read`
- `im:write`
- `app_home:read`
- `app_home:write`

#### Event Subscriptions:
- `app_mention`
- `app_home_opened`
- `message.im`

#### Socket Mode:
- Enable Socket Mode
- Note the App-Level Token (starts with `xapp-`)

### 4. 📝 Fill in Your .env File
```env
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token
SLACK_SIGNING_SECRET=your-actual-signing-secret
SLACK_APP_TOKEN=xapp-your-actual-app-token
OPENAI_API_KEY=your-actual-openai-api-key
```

### 5. 🚀 Run Your Bot!
```bash
# Test the setup first
node test-bot.js

# Start the bot
npm start

# Or use the startup script
./start.sh
```

## 🎯 What Your Bot Will Do

- **9:00 AM**: Morning motivation and goal-setting
- **2:00 PM**: Afternoon check-in and progress review
- **6:00 PM**: Evening reflection and celebration
- **9:00 PM**: Goodnight gratitude and tomorrow's focus

## 💬 How to Use

- **Direct Message**: Send the bot a private message
- **Mention**: `@MotivationalFriend I need help!`
- **App Home**: Click on the bot in your sidebar

## 🚨 Troubleshooting

- **Bot not responding?** Check your Slack app permissions
- **Scheduled messages not working?** Verify your timezone setting
- **OpenAI errors?** Ensure your API key is valid and has credits

## 🎉 You're All Set!

Your motivational AI friend is ready to help you achieve your goals! 🚀
