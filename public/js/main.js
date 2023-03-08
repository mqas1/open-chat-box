const topicList = document.querySelector("#topic-list");
const createTopic = document.getElementById("submitTopic");
const newTopicInput = document.getElementById("newTopicInput");
const showBtn = document.querySelector(".showInput");
const chatMessages = document.querySelector(".chat-messages");
const resultArr = [];
const socket = io();

// Extending dayjs to use the advanced format
dayjs.extend(window.dayjs_plugin_advancedFormat);

// Fetch request for topics from MySQL database
const getTopics = () => 
  fetch("/api/topics", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data);

// Function for formatting topics data from the database
const renderTopic = (topic) => {
  const liEl = document.createElement("li");
  liEl.classList.add("topic-list-li");
  liEl.setAttribute("data-id", topic.id);
  liEl.setAttribute("data-state", "inert");
  liEl.innerHTML = topic.topic_name;

  topicList.appendChild(liEl);
};

// API call to post new topic to the database
const newTopic = async () => {
  const topic_name = document.querySelector("#newTopicInput").value.trim();
  if (topic_name) {
    const response = await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({
        topic_name: topic_name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      socketsTopic();
    } else {
      console.log("Failed to create new topic");
    }
  }
};

// Promise constructor to get "topics" from the DOM
const getTopicsDOM = () => {
  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topics = Array.from(topicListLiEl);
  return Promise.resolve(topics);
};

/* Function for Sockets to listen to new "topics" entries into the database.
  It compares the number of topics in the db against the DOM.
*/
const socketsTopic = async () => {
  getTopicsDOM()
    .then(async (resolved) => {
      const topicIDArr = resolved.map((x) => parseInt(x.dataset.id));
      await fetch("/api/topics", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            console.log("no topics found");
          } else {
            const dbTopic = data.map((topic) => topic.id);
            dbTopic.forEach((topic_id) => {
              if (!topicIDArr.includes(topic_id)) {
                const filterData = data.filter((topic) => {
                  return topic.id === topic_id;
                });
                resultArr.push(filterData);
              } else {
                return;
              }
            resultArr.forEach((item) => socket.emit("chatTopic", item));
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// Sockets sending new "topics" data to the client
socket.on("topic", (topic) => {
  for (let i = 0; i < topic.length; i++) {
    renderTopic(topic[i]);
  }
});

createTopic.addEventListener("click", function (event) {
  event.preventDefault();
  resultArr.length = 0;
  newTopic();
  newTopicInput.value = "";
  newTopicInput.focus();
});

// Function for displaying "messages" from the database for the desired "topic"
const topicsListHandler = (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.dataset.id;

    fetch("/api/messages", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.log("no messages in this topic");
        } else {
          const topicMessages = data.filter((message) => {
            return message.topic_id === parseInt(id);
          });
        topicMessages.forEach((item) => renderMessages(item));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

/* Function for formatting "messages" both from the database
  and Sockets emitting to the client.
*/
const renderMessages = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute("data-msg-id", message.id);
  div.setAttribute("data-topic-id", message.topic_id);

  const messageTime = dayjs(message.date_created).format("MMMM Do YYYY, h:mm a");

  div.innerHTML = `<p class="user-time">${message.user.user_name} <span>${messageTime}</span></p>
  <p class="text">${message.content}</p>`;
  chatMessages.appendChild(div);
};

/* The default value to "data-state" on every "topic" is "intert".
  This function changes the value on a selected topic to "active"
*/
const compareDataState = (event) => {
  const element = event.target;
  getTopicsDOM()
    .then((resolved) => {
      const topicArr = resolved;
      topicArr.forEach((x) => {
        let topic = x;
        let state = x.dataset.state;
        if (topic === element) {
          if (state === "inert") {
            element.dataset.state = "active";
          }
        } else {
          topic.dataset.state = "inert";
        }
      });
    })
    .catch((err) => console.log(err));
};

topicList.addEventListener("click", function (event) {
  event.preventDefault();
  chatMessages.innerHTML = "";
  topicsListHandler(event);
  compareDataState(event);
});

const chatForm = document.getElementById("chat-form");
const result = [];

// Promise constructor to get the id from the "active" "topic"
const getActiveTopic = (topics) => {
  const topicActive = topics.filter((topic) => {
    return topic.dataset.state === "active";
});
  const topic_id = parseInt(topicActive[0].dataset.id);
  return Promise.resolve(topic_id);
};

// Function for storing a user "message" in the database
const messageHandler = async () => {
  const content = document.querySelector("#msg").value.trim();
  
  getTopicsDOM()
    .then(getActiveTopic)
    .then(async (resolved) => {
      const topic_id = resolved;
      if (content, topic_id) {
        const response = await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({
            content: content,
            topic_id: topic_id,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });
    
        if (response.ok) {
          socketsMessage();
        } else {
          console.log("Failed to create new message");
        }
      }
    })
    .catch((err) => console.error(err));
};

/* Function for Sockets to listen to new "messages" stored in the database.
It filters "messages" to be relevant to the "active" "topic" and then compares
the database "messages" against those in the DOM. Those not in the DOM are then
sent to Sockets to send back to the client for the live chat.
*/
const socketsMessage = async () => {
  const messageTree = document.querySelectorAll(".message");
  const messageArr = Array.from(messageTree);

  const messageIDArr = messageArr.map((i) => parseInt(i.dataset.msgId));

  getTopicsDOM()
    .then(getActiveTopic)
    .then(async (resolved) => {
      const topic_id = resolved;
      await fetch("/api/messages", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            console.log("no messages found");
          } else {
            const topicIdMatch = data.filter((j) => {
              return j.topic_id === topic_id;
            });
            const dbMessage = topicIdMatch.map((message) => message.id);
            dbMessage.forEach((message_id) => {
              if (!messageIDArr.includes(message_id)) {
                const filterData = data.filter((message) => {
                  return message.id === message_id;
                });
                result.push(filterData);
              } else {
                return;
              }
            result.forEach((item) => socket.emit("chatMessage", item));
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

/* "message" from server. Will only send back to the client if the user
  is on the same "topic" that the "message" belongs to
*/
socket.on("message", (message) => {
  getTopicsDOM()
    .then(getActiveTopic)
    .then((resolved) => {
      const topic_id = resolved;
      for (let i = 0; i < message.length; i++) {
        if (message[i].topic_id === topic_id) {
          renderMessages(message[i]);
        } else {
          return;
        }
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch((err) => console.error(err));
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  result.length = 0;

  messageHandler();

// clear input form
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Formatting messages sent from the server as "Open Chat Box"
const openChatMsg = (content) => {
  const div = document.createElement("div");
  div.classList.add("message");
  
  const messageTime = dayjs().format("MMMM Do YYYY, h:mm a");
  
  div.innerHTML = `<p class="user-time">Open Chat Box <span>${messageTime}</span></p>
  <p class="text">${content}</p>`;
  chatMessages.appendChild(div);
};

socket.on("server", (message) => {
  openChatMsg(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Populates the page with topics upon refresh
const init = () => {
  topicList.innerHTML = "";
  getTopics().then((response) => response.forEach((item) => renderTopic(item)));
};

init();