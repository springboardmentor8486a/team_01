const express = require('express');
const router = express.Router();
const { registerController, loginController, forgotPasswordController, verifyOtpController, resetPasswordController, logoutController, uploadProfileController } = require('../controller/authController');
const { refreshTokenController } = require('../controller/refreshTokenController');
const authenticateJWT = require('../middleware/authMiddleware');

const upload = require('../middleware/multer');

// register
router.post('/register', upload.single('profileImage'), registerController);
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

// profile image upload
router.post('/upload-profile', authenticateJWT, upload.single('profileImage'), uploadProfileController);

// Example protected route (uncomment to use)
// router.get('/protected', authenticateJWT, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
