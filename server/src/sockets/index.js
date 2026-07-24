const { Server } = require('socket.io');
const { verifyAccess } = require('../utils/jwt');
const User = require('../models/User');
const { setIO } = require('./registry');
const logger = require('../utils/logger');

module.exports = function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true },
    pingInterval: 25_000,
  });
  setIO(io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) return next(new Error('unauthorized'));
      const decoded = verifyAccess(token);
      socket.userId = decoded.id;
      const u = await User.findById(decoded.id).select('name username avatar');
      socket.user = u;
      next();
    } catch (e) { next(new Error('unauthorized')); }
  });

  io.on('connection', async (socket) => {
    logger.info(`socket ${socket.id} user ${socket.userId} connected`);
    await User.findByIdAndUpdate(socket.userId, { online: true, lastSeen: new Date() });
    io.emit('online', { userId: socket.userId });

    socket.on('channel:join', (channelId) => socket.join(`channel:${channelId}`));
    socket.on('channel:leave', (channelId) => socket.leave(`channel:${channelId}`));

    socket.on('typing', ({ channelId, isTyping }) => {
      socket.to(`channel:${channelId}`).emit('typing', { channelId, userId: socket.userId, user: socket.user, isTyping });
    });

    socket.on('kanban', (payload) => io.emit('kanban', payload));
    socket.on('activity', (payload) => io.emit('activity', payload));

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { online: false, lastSeen: new Date() });
      io.emit('offline', { userId: socket.userId });
    });
  });

  return io;
};
