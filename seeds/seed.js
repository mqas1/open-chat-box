const sequelize = require('../config/connection');
const { User, Topic, Message } = require('../models');

const userData = require('./userData.json');
const topicData = require('./topicData.json');
const messageData = require('./messageData.json');

const seedAll = async () => {
    await sequelize.sync({ force: true });

    const seedUser = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });
    
    const seedTopic = await Topic.bulkCreate(topicData, {
      individualHooks: true,
      returning: true,
    });

    const seedMessage = await Message.bulkCreate(messageData, {
      individualHooks: true,
      returning: true,
    });
    
    process.exit(0);
  };

seedAll();