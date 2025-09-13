const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Refresh Token Controller
const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token required" });
    }
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
            }
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const accessToken = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            return res.status(200).json({
                success: true,
                accessToken
            });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Could not refresh token", error: error.message });
    }
};

module.exports = { refreshTokenController };
