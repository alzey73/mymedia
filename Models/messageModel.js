const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chatFilePath: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);
