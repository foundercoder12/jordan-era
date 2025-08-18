// Simple persistent storage for user emails
const fs = require('fs');
const path = require('path');

const EMAILS_FILE = path.join(__dirname, 'user-emails.json');

function loadEmails() {
  try {
    if (fs.existsSync(EMAILS_FILE)) {
      return JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading emails:', e);
  }
  return {};
}

function saveEmails(emails) {
  try {
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving emails:', e);
  }
}

module.exports = { loadEmails, saveEmails, EMAILS_FILE };
