const sequelize = require('../config/connection');
const { User, Topic, Message } = require('../models');

const x = require('./userData.json');
const y = require('./topicData.json');
const z = require('./messageData.json');





const seedAll = async () => {
    await sequelize.sync({ force: true });

    const seedUser = await User.bulkCreate(x, {
      individualHooks: true,
      returning: true,
    });
    
    const seedTopic = await Topic.bulkCreate(y, {
      individualHooks: true,
      returning: true,
    });

    const seedMessage = await Message.bulkCreate(z, {
      individualHooks: true,
      returning: true,
    });
    
    process.exit(0);
  };


  
  seedAll();