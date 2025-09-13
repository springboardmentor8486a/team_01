const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controller/authController');
const { refreshTokenController } = require('../controller/refreshTokenController');
const authenticateJWT = require('../middleware/authMiddleware');

// register
router.post('/register', registerController);
// login
router.post('/login', loginController);
// refresh token
router.post('/refresh-token', refreshTokenController);

// Example protected route (uncomment to use)
// router.get('/protected', authenticateJWT, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
