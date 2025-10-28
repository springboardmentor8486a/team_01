const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
    return nodemailer.createTransport({
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

        // Check if email is configured
        const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        let emailSent = false;

        if (emailConfigured) {
            try {
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
                    from: process.env.EMAIL_USER,
                    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                    subject: `New Feedback - Rating: ${rating}/5`,
                    html: emailContent,
                    replyTo: userEmail
                };

                // Send feedback to admin
                await transporter.sendMail(mailOptions);

                // Send confirmation email to user (only if user has a valid email)
                if (userEmail && userEmail !== 'anonymous@example.com') {
                    const userConfirmationEmail = {
                        from: process.env.EMAIL_USER,
                        to: userEmail,
                        subject: 'Thank you for your feedback - CleanStreet',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                                    <h1>CleanStreet</h1>
                                    <h2>Thank You for Your Feedback!</h2>
                                </div>
                                <div style="padding: 20px; background-color: #f8fafc;">
                                    <p>Dear ${userName},</p>
                                    <p>Thank you for taking the time to share your feedback with us. Your input is valuable and helps us improve our services.</p>
                                    
                                    <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <h3>Your Feedback Summary:</h3>
                                        <p><strong>Service/Issue:</strong> ${service || 'General feedback'}</p>
                                        <p><strong>Rating:</strong> ${rating}/5 stars</p>
                                        <p><strong>Comments:</strong> ${comments}</p>
                                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                                    </div>
                                    
                                    <p>We review all feedback carefully and use it to enhance our community services. If your feedback requires a response, our team will get back to you within 2-3 business days.</p>
                                    
                                    <p>Thank you for helping us make our community better!</p>
                                    
                                    <p>Best regards,<br>
                                    The CleanStreet Team</p>
                                </div>
                                <div style="background-color: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px;">
                                    <p>&copy; 2025 CleanStreet. All rights reserved.</p>
                                    <p>This is an automated message. Please do not reply to this email.</p>
                                </div>
                            </div>
                        `
                    };

                    // Send confirmation email to user
                    await transporter.sendMail(userConfirmationEmail);
                }

                emailSent = true;
                console.log('Emails sent successfully');
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the entire request if email fails
            }
        } else {
            console.log('Email not configured - skipping email notifications');
        }

        // Always respond with success, regardless of email status
        const message = emailSent 
            ? 'Feedback submitted successfully! A confirmation email has been sent to your email address.'
            : 'Feedback submitted successfully! Thank you for your input.';

        res.status(StatusCodes.CREATED).json({
            message,
            success: true,
            emailSent
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
