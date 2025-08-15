// Demo script to showcase the motivational bot's capabilities
const OpenAI = require('openai');
require('dotenv').config();

console.log('🎭 Motivational Bot Demo Mode\n');

// Demo conversation flow
const demoConversations = [
  {
    user: "I want to finish my project today but I'm feeling overwhelmed",
    context: "User is feeling overwhelmed with a project deadline"
  },
  {
    user: "I'm procrastinating on starting",
    context: "User is struggling with procrastination"
  },
  {
    user: "I accomplished something great today!",
    context: "User is celebrating a success"
  },
  {
    user: "How can I stay motivated when things get tough?",
    context: "User is asking for motivation strategies"
  }
];

// Bot personality for demo
const botPersonality = `You are a motivational friend named MotivationalFriend. 
You are supportive, encouraging, and genuinely care about helping people achieve their goals. 
You ask thoughtful questions, provide gentle motivation, and help people overcome obstacles. 
Keep responses friendly, conversational, and under 200 words.`;

async function runDemo() {
  console.log('🤖 Bot Personality:');
  console.log(botPersonality);
  console.log('\n' + '='.repeat(60) + '\n');

  for (let i = 0; i < demoConversations.length; i++) {
    const conversation = demoConversations[i];
    
    console.log(`👤 User (${conversation.context}):`);
    console.log(`"${conversation.user}"\n`);
    
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: botPersonality },
            { role: 'user', content: conversation.user }
          ],
          max_tokens: 200,
          temperature: 0.8,
        });

        console.log('🤖 Bot Response:');
        console.log(`"${completion.choices[0].message.content}"\n`);
      } catch (error) {
        console.log('🤖 Bot Response (Demo Mode):');
        console.log('"I would respond with an encouraging message here!"\n');
      }
    } else {
      console.log('🤖 Bot Response (Demo Mode):');
      console.log('"I would respond with an encouraging message here!"\n');
    }
    
    console.log('─'.repeat(60) + '\n');
    
    // Add a small delay between conversations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎯 Scheduled Reminders Demo:');
  console.log('🌅 9:00 AM - Morning motivation and goal-setting');
  console.log('☀️ 2:00 PM - Afternoon check-in and progress review');
  console.log('🌙 6:00 PM - Evening reflection and celebration');
  console.log('😴 9:00 PM - Goodnight gratitude and tomorrow\'s focus\n');

  console.log('💡 Demo Complete!');
  console.log('To run the actual bot, set up your API keys and run: npm start');
}

// Run the demo
runDemo().catch(console.error);
