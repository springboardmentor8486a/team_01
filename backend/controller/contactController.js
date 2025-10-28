const { StatusCodes } = require('http-status-codes');
const User = require('../model/userModel');
const { sendWelcomeEmail } = require('../helpers/emailService');

const registerVolunteer = async (req, res) => {
    try {
        console.log('Received volunteer registration request:', req.body); // Debug log

        const { fullName, email, preferredArea, skills } = req.body;

        if (!fullName || !email || !preferredArea) {
            console.log('Missing required fields'); // Debug log
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Missing required fields. Please fill in all required information.'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        console.log('Existing user check:', user ? 'User found' : 'No user found'); // Debug log
        
        if (user) {
            // If user exists, check if they're already a volunteer
            if (user.roles.includes('volunteer')) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'User is already registered as a volunteer'
                });
            }

            // Update existing user to be a volunteer
            user.roles.push('volunteer');
            user.preferredArea = preferredArea;
            user.skills = skills;
            await user.save();
        } else {
            // Create new user with volunteer role
            user = await User.create({
                name: fullName,
                email,
                roles: ['volunteer'],
                preferredArea,
                skills,
                password: Math.random().toString(36).slice(-8) // Generate a random password
            });

            // Send welcome email with credentials
            await sendWelcomeEmail(email, {
                name: fullName,
                password: user.password,
                role: 'volunteer'
            });
        }

        res.status(StatusCodes.CREATED).json({
            message: 'Volunteer registration successful',
            user: {
                name: user.name,
                email: user.email,
                preferredArea: user.preferredArea,
                roles: user.roles
            }
        });
    } catch (error) {
        console.error('Error in volunteer registration:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error registering volunteer',
            error: error.message
        });
    }
};

module.exports = {
    registerVolunteer
};