const router = require('express').Router();
const userRoutes = require('./userRoutes');
const topicRoutes = require('./topicRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/users', userRoutes);
router.use('/topics', topicRoutes);
router.use('/messages', messageRoutes);

module.exports = router;