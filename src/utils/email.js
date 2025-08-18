import sgMail from '@sendgrid/mail';

// SendGrid setup for email invites
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function generateICS(subject, description, startTime, endTime, location) {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JordanBot//EN
BEGIN:VEVENT
UID:${Date.now()}@jordanbot
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:${subject}
DESCRIPTION:${description}
LOCATION:${location || ''}
END:VEVENT
END:VCALENDAR`;
}

export async function sendCalendarInviteEmail(to, subject, description, startTime, endTime, location) {
  const icsContent = generateICS(subject, description, startTime, endTime, location);
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text: description,
    attachments: [
      {
        content: Buffer.from(icsContent).toString('base64'),
        filename: 'invite.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ],
  };
  await sgMail.send(msg);
}
