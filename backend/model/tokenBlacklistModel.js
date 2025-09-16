const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index to auto-remove expired tokens
    }
});

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklist;
