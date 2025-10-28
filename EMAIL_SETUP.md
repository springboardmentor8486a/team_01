# Email Setup for Feedback System

## Overview
The feedback system now includes email functionality using Nodemailer. When users submit feedback, two emails are sent:
1. **Admin notification**: Sent to admin with feedback details
2. **User confirmation**: Sent to user confirming their feedback submission

## Setup Instructions

### 1. Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Create a `.env` file in the backend directory with:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=admin@yourcompany.com
```

### 3. Alternative Email Services

You can also use other email services by modifying the transporter in `feedbackController.js`:

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.yourprovider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## How It Works

### User Flow
1. User fills out feedback form
2. Submits feedback via `/api/feedback/submit`
3. Backend sends email to admin with feedback details
4. Backend sends confirmation email to user
5. User sees success message with email confirmation notice

### Email Templates

#### Admin Email
- Contains all feedback details
- User information
- Rating and comments
- Timestamp

#### User Confirmation Email
- Professional HTML template
- Feedback summary
- Thank you message
- Company branding

## Testing

1. **Start the backend server**: `npm run dev`
2. **Submit feedback** through the frontend
3. **Check both email addresses** for received emails
4. **Check console logs** for any email sending errors

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Ensure 2FA is enabled
   - Use app password, not regular password
   - Check EMAIL_USER format

2. **"Connection timeout" error**
   - Check internet connection
   - Verify SMTP settings
   - Try different email service

3. **Emails not received**
   - Check spam/junk folders
   - Verify email addresses in .env
   - Check server logs for errors

### Debug Mode

Add this to see detailed email logs:

```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Add this line
    logger: true // Add this line
});
```

## Security Notes

- Never commit `.env` file to version control
- Use app passwords, not regular passwords
- Regularly rotate email credentials
- Consider using email service APIs for production (SendGrid, Mailgun, etc.)
