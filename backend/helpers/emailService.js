const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw error;
    }
};

const sendWelcomeEmail = async (to, userData) => {
    try {
        const subject = `Welcome to CleanStreet - ${userData.role} Registration Successful`;
        const text = `
Hello ${userData.name},

Welcome to CleanStreet! Your ${userData.role} registration has been successful.

${userData.password ? `Your temporary password is: ${userData.password}` : ''}

Please log in to your account to get started.

Best regards,
CleanStreet Team
        `;
        
        return await sendEmail(to, subject, text);
    } catch (error) {
        throw error;
    }
};

const sendContactMessage = async (contactData) => {
    try {
        // Send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        const subject = `New Contact Message: ${contactData.subject}`;
        const text = `
New contact message received:

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

---
This message was sent through the CleanStreet contact form.
        `;
        
        // Send to admin
        await sendEmail(adminEmail, subject, text);
        
        // Send confirmation to user
        const confirmationSubject = 'Thank you for contacting CleanStreet';
        const confirmationText = `
Hello ${contactData.name},

Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.

Your message:
Subject: ${contactData.subject}
Message: ${contactData.message}

Best regards,
CleanStreet Team
        `;
        
        await sendEmail(contactData.email, confirmationSubject, confirmationText);
        
        return { success: true, message: 'Contact message sent successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendContactMessage,
    transporter
};
