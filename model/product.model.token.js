const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken:{
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;