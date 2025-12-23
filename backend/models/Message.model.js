const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  linkPreview: {
    title: String,
    description: String,
    url: String
  },
  attachment: {
    url: String,
    publicId: String,
    fileName: String,
    fileType: String, // 'image', 'video', 'audio', 'document'
    mimeType: String,
    size: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
