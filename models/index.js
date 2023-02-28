const User = require("./User");
const Topic = require("./Topic");
const Message = require("./Message");

User.hasMany(Topic, { foreignKey: "user_id" });
Topic.belongsTo(User, { foreignKey: "user_id" });
Topic.hasMany(Message, { foreignKey: "topic_id" });
Message.belongsTo(Topic, { foreignKey: "topic_id" });
User.hasMany(Message, { foreignKey: "user_id" });
Message.belongsTo(User, { foreignKey: "user_id" });

module.exports = { User, Topic, Message };


