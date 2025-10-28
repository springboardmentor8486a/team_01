const User = require('../model/userModel');
const { StatusCodes } = require('http-status-codes');

const registerVolunteer = async (req, res) => {
    try {
        const { fullName, email, preferredArea, skills } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            // If user exists, update their role to include volunteer
            if (!user.roles.includes('volunteer')) {
                user.roles.push('volunteer');
                user.preferredArea = preferredArea;
                user.skills = skills;
                await user.save();
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'User is already registered as a volunteer'
                });
            }
        } else {
            // Create new user with volunteer role
            user = await User.create({
                name: fullName,
                email,
                roles: ['volunteer'],
                preferredArea,
                skills
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