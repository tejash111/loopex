// Load environment variables first, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database.config');
const authRoutes = require('./routes/auth.routes');
const onboardingRoutes = require('./routes/onboarding.routes');
const projectRoutes = require('./routes/project.routes');
const profileRoutes = require('./routes/profile.routes');
const searchRoutes = require('./routes/search.routes');
const shortlistRoutes = require('./routes/shortlist.routes');
const messageRoutes = require('./routes/message.routes');
const Message = require('./models/Message.model');
const messageController = require('./controllers/message.controller');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://loopex.vercel.app",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: [
        "https://loopex.vercel.app",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io connection handling
const userSockets = new Map(); // Map userId to socketId
const onlineUsers = new Set(); // Track online users

// Provide online users getter to message controller
messageController.setOnlineUsersGetter(() => Array.from(onlineUsers));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their userId
    socket.on('join', (userId) => {
        userSockets.set(userId, socket.id);
        onlineUsers.add(userId);
        socket.userId = userId;
        console.log(`User ${userId} joined with socket ${socket.id}`);

        // Broadcast to all users that this user is online
        io.emit('user_online', { userId });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
        try {
            const { senderId, receiverId, content, linkPreview, attachment } = data;

            // Save message to database
            const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                linkPreview,
                attachment
            });

            await message.save();
            await message.populate('sender', 'name email');

            const messageData = {
                id: message._id,
                content: message.content,
                timestamp: message.createdAt,
                sender: {
                    _id: message.sender._id,
                    name: message.sender.name,
                    email: message.sender.email
                },
                linkPreview: message.linkPreview,
                attachment: message.attachment
            };

            // Send to receiver if they're online
            const receiverSocketId = userSockets.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', {
                    ...messageData,
                    isOwn: false
                });
            }

            // Send confirmation back to sender
            socket.emit('message_sent', {
                ...messageData,
                isOwn: true
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message_error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        const { receiverId } = data;
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_typing', {
                userId: socket.userId
            });
        }
    });

    socket.on('stop_typing', (data) => {
        const { receiverId } = data;
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_stop_typing', {
                userId: socket.userId
            });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (socket.userId) {
            userSockets.delete(socket.userId);
            onlineUsers.delete(socket.userId);
            console.log(`User ${socket.userId} disconnected`);

            // Broadcast to all users that this user is offline
            io.emit('user_offline', { userId: socket.userId });
        }
    });
});

// Expose online users to the application
app.get('/api/online-users', (req, res) => {
    res.json({
        success: true,
        onlineUsers: Array.from(onlineUsers)
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

module.exports = { app, io };
