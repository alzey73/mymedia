const mongoose = require('mongoose');

const userPageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'image', 'message'],
        required: true
    },    
    description: String,
    path: { 
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserPage = mongoose.model('UserPage', userPageSchema);

module.exports = UserPage;


