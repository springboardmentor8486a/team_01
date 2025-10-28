const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail', // You can change this to your preferred email service
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com', // Add to .env file
            pass: process.env.EMAIL_PASS || 'your-app-password'     // Add to .env file
        }
    });
};

const submitFeedback = async (req, res) => {
    try {
        console.log('Received feedback submission:', req.body);

        const { service, rating, comments } = req.body;
        const userEmail = req.user?.email || 'anonymous@example.com';
        const userName = req.user?.name || 'Anonymous User';

        if (!rating || !comments) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Rating and comments are required fields.'
            });
        }

        // Create email content
        const emailContent = `
            <h2>New Feedback Received</h2>
            <p><strong>From:</strong> ${userName} (${userEmail})</p>
            <p><strong>Service/Issue:</strong> ${service || 'Not specified'}</p>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p><strong>Comments:</strong></p>
            <p>${comments}</p>
            <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `;

        // Create transporter
        const transporter = createTransporter();

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: process.env.ADMIN_EMAIL || 'admin@cleanstreet.com', // Admin email to receive feedback
            subject: `New Feedback - Rating: ${rating}/5`,
            html: emailContent,
            replyTo: userEmail
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(StatusCodes.CREATED).json({
            message: 'Feedback submitted successfully! Thank you for your input.',
            success: true
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error submitting feedback. Please try again.',
            error: error.message
        });
    }
};

module.exports = {
    submitFeedback
};
