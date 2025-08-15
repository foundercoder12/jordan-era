// Simple test script to verify bot setup
const OpenAI = require('openai');
require('dotenv').config();

console.log('🧪 Testing Motivational Slack Bot Setup...\n');

// Test environment variables
console.log('📋 Environment Variables Check:');
console.log(`SLACK_BOT_TOKEN: ${process.env.SLACK_BOT_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`SLACK_SIGNING_SECRET: ${process.env.SLACK_SIGNING_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`SLACK_APP_TOKEN: ${process.env.SLACK_APP_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`BOT_NAME: ${process.env.BOT_NAME || 'MotivationalFriend (default)'}`);
console.log(`TIMEZONE: ${process.env.TIMEZONE || 'America/New_York (default)'}\n`);

// Test OpenAI connection (if API key is set)
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  console.log('🔗 Testing OpenAI Connection...');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Simple test prompt
  const testPrompt = "Hello! Can you give me a quick motivational message in one sentence?";
  
  openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a motivational friend. Keep responses short and encouraging.' },
      { role: 'user', content: testPrompt }
    ],
    max_tokens: 50,
    temperature: 0.8,
  })
  .then(response => {
    console.log('✅ OpenAI connection successful!');
    console.log(`🤖 Test response: "${response.choices[0].message.content}"\n`);
  })
  .catch(error => {
    console.log('❌ OpenAI connection failed:', error.message);
    console.log('💡 Check your API key and internet connection\n');
  });
} else {
  console.log('⚠️  OpenAI API key not set - skipping connection test\n');
}

// Test dependencies
console.log('📦 Dependencies Check:');
try {
  require('@slack/bolt');
  console.log('✅ @slack/bolt - OK');
} catch (e) {
  console.log('❌ @slack/bolt - Missing');
}

try {
  require('node-cron');
  console.log('✅ node-cron - OK');
} catch (e) {
  console.log('❌ node-cron - Missing');
}

try {
  require('moment');
  console.log('✅ moment - OK');
} catch (e) {
  console.log('❌ moment - Missing');
}

console.log('\n🎯 Setup Summary:');
if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_BOT_TOKEN !== 'xoxb-your-bot-token-here') {
  console.log('✅ Slack bot token configured');
} else {
  console.log('❌ Slack bot token needs to be configured');
}

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  console.log('✅ OpenAI API key configured');
} else {
  console.log('❌ OpenAI API key needs to be configured');
}

console.log('\n📚 Next Steps:');
console.log('1. Copy env.example to .env: cp env.example .env');
console.log('2. Fill in your API keys in the .env file');
console.log('3. Create and configure your Slack app at api.slack.com/apps');
console.log('4. Run the bot: npm start or ./start.sh');
console.log('\n🚀 Ready to get motivated!');
