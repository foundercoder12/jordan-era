#!/bin/bash

echo "🚀 Starting Motivational Slack Bot..."
echo "📝 Make sure you have set up your .env file with API keys"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy env.example to .env and fill in your API keys"
    echo "   cp env.example .env"
    exit 1
fi

# Check if required environment variables are set
source .env

if [ -z "$SLACK_BOT_TOKEN" ] || [ "$SLACK_BOT_TOKEN" = "xoxb-your-bot-token-here" ]; then
    echo "❌ SLACK_BOT_TOKEN not set properly in .env file"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your-openai-api-key-here" ]; then
    echo "❌ OPENAI_API_KEY not set properly in .env file"
    exit 1
fi

echo "✅ Environment variables look good!"
echo "🤖 Starting bot..."
echo ""

npm start
