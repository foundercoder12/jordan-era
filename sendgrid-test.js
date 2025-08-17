require('dotenv').config();
const sg = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
const sender = process.env.SENDER_EMAIL;
const testRecipient = 'jainam@gvine.app';

if (!apiKey || !apiKey.startsWith('SG.')) {
  console.error('Invalid or missing SENDGRID_API_KEY.');
  process.exit(1);
}
if (!sender) {
  console.error('Missing SENDER_EMAIL.');
  process.exit(1);
}

sg.setApiKey(apiKey);

sg.send({
  to: testRecipient,
  from: sender,
  subject: 'Test Email from Slack Motivational Bot',
  text: 'This is a test email sent using SendGrid integration.'
})
  .then(() => console.log('Test email sent successfully to', testRecipient))
  .catch((err) => {
    console.error('Error sending test email:', err.message);
    process.exit(1);
  });
