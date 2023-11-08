const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true // Her sohbet için benzersiz bir chatId olmalı
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  chatFilePath: {
    type: String,
    required: true
  },
  lastMessage: {
    type: String,
    required: true
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // createdAt ve updatedAt alanlarını otomatik olarak ekler

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
