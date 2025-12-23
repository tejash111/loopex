const Message = require('../models/Message.model');
const User = require('../models/User.model');
const cloudinary = require('../config/cloudinary.config');
const streamifier = require('streamifier');

// Get online users (to be used by the server)
let getOnlineUsers = () => [];

// Set the online users getter function
exports.setOnlineUsersGetter = (getter) => {
  getOnlineUsers = getter;
};

// Get all users for messaging
exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('name email')
      .lean();

    // Get online users
    const onlineUserIds = getOnlineUsers();
    const onlineUserIdsSet = new Set(onlineUserIds.map(id => id.toString()));

    // Get last message for each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId }
          ]
        })
          .sort({ createdAt: -1 })
          .lean();

        // Get unread count
        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: currentUserId,
          read: false
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          lastMessage: lastMessage ? lastMessage.content : '',
          timestamp: lastMessage ? lastMessage.createdAt : null,
          unreadCount,
          isOnline: onlineUserIdsSet.has(user._id.toString())
        };
      })
    );

    // Sort by last message timestamp
    usersWithLastMessage.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    res.json({
      success: true,
      users: usersWithLastMessage
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get conversation with a specific user
exports.getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get the other user's details
    const otherUser = await User.findById(userId).select('name email');
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        read: false
      },
      { read: true }
    );

    // Format messages
    const formattedMessages = messages.map(msg => {
      const isOwn = msg.sender.toString() === currentUserId.toString();
      console.log('Message:', msg.content, 'sender:', msg.sender.toString(), 'currentUserId:', currentUserId.toString(), 'isOwn:', isOwn);
      return {
        id: msg._id,
        content: msg.content,
        timestamp: msg.createdAt,
        isOwn,
        linkPreview: msg.linkPreview
      };
    });

    res.json({
      success: true,
      user: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email
      },
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { receiverId, content, linkPreview } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required'
      });
    }

    // Either content or file attachment is required
    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Message content or file attachment is required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    let attachment = null;

    // Handle file upload to Cloudinary
    if (req.file) {
      try {
        // Determine resource type based on mimetype
        let resourceType = 'auto';
        let fileType = 'document';

        if (req.file.mimetype.startsWith('image/')) {
          resourceType = 'image';
          fileType = 'image';
        } else if (req.file.mimetype.startsWith('video/')) {
          resourceType = 'video';
          fileType = 'video';
        } else if (req.file.mimetype.startsWith('audio/')) {
          resourceType = 'video'; // Cloudinary uses 'video' for audio files
          fileType = 'audio';
        }

        // Upload to Cloudinary using stream
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: resourceType,
              folder: 'loopex/messages',
              allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'mp3', 'mp4']
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        attachment = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          fileName: req.file.originalname,
          fileType: fileType,
          mimeType: req.file.mimetype,
          size: req.file.size
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file',
          error: uploadError.message
        });
      }
    }

    // Create message
    const message = new Message({
      sender: currentUserId,
      receiver: receiverId,
      content: content || '',
      linkPreview,
      attachment
    });

    await message.save();

    // Populate sender info
    await message.populate('sender', 'name email');

    res.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        timestamp: message.createdAt,
        isOwn: true,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email
        },
        linkPreview: message.linkPreview,
        attachment: message.attachment
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const unreadCount = await Message.countDocuments({
      receiver: currentUserId,
      read: false
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};
