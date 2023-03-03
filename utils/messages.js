const moment = require("moment");

function formatMessage(userName, text) {
  return {
    userName,
    text,
    time: moment().format("MMMM Do YYYY, h:mm a"),
  };
}

module.exports = formatMessage;
