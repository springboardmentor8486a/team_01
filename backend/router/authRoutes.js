const express = require('express');
const router = express.Router();
const { registerController, loginController, forgotPasswordController, verifyOtpController, resetPasswordController, logoutController } = require('../controller/authController');
const { refreshTokenController } = require('../controller/refreshTokenController');
const authenticateJWT = require('../middleware/authMiddleware');

// register
router.post('/register', registerController);
// login
router.post('/login', loginController);
// forgot password - send OTP
router.post('/forgot-password', forgotPasswordController);
// verify OTP
router.post('/verify-otp', verifyOtpController);
// reset password
router.post('/reset-password', resetPasswordController);
// refresh token
router.post('/refresh-token', refreshTokenController);
// logout
router.post('/logout', authenticateJWT, logoutController);

// Example protected route (uncomment to use)
// router.get('/protected', authenticateJWT, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
