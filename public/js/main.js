const topicList = document.querySelector("#topic-list");
const createTopic = document.getElementById("submitTopic");
const newTopicInput = document.getElementById("newTopicInput");
const showBtn = document.querySelector(".showInput");
const chatMessages = document.querySelector(".chat-messages");
const resultArr = [];
const socket = io();

const getTopics = () =>
  fetch("/api/topics", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data);

const renderTopic = (topic) => {
  const liEl = document.createElement("li");
  liEl.classList.add("topic-list-li");
  liEl.setAttribute("data-id", topic.id);
  liEl.setAttribute("data-state", "inert");
  liEl.innerHTML = topic.topic_name;

  topicList.appendChild(liEl);
};

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

const socketsTopic = async () => {
  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);

  const topicIDArr = topicArr.map((x) => parseInt(x.dataset.id));

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
};

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

const renderMessages = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute("data-msg-id", message.id);
  div.setAttribute("data-topic-id", message.topic_id);

  dayjs.extend(window.dayjs_plugin_advancedFormat);
  const messageTime = dayjs(message.date_created).format(
    "MMMM Do YYYY, h:mm a"
  );

  div.innerHTML = `<p class="user-time">${message.user.user_name} <span>${messageTime}</span></p>
  <p class="text">${message.content}</p>`;
  chatMessages.appendChild(div);
};

const compareDataState = (event) => {
  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);

  const element = event.target;

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
};

topicList.addEventListener("click", function (event) {
  event.preventDefault();
  chatMessages.innerHTML = "";
  topicsListHandler(event);
  compareDataState(event);
});

const chatForm = document.getElementById("chat-form");
const result = [];

const messageHandler = async () => {
  const content = document.querySelector("#msg").value.trim();

  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);

  const topicActive = topicArr.filter((topic) => {
    return topic.dataset.state === "active";
  });
  const topic_id = parseInt(topicActive[0].dataset.id);

  if ((content, topic_id)) {
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
};

const socketsMessage = async () => {
  const messageTree = document.querySelectorAll(".message");
  const messageArr = Array.from(messageTree);

  const messageIDArr = messageArr.map((i) => parseInt(i.dataset.msgId));

  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);

  const topicActive = topicArr.filter((topic) => {
    return topic.dataset.state === "active";
  });
  const ActiveTopicId = parseInt(topicActive[0].dataset.id);

  await fetch("/api/messages", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        console.log("no messages found");
      } else {
        const topicIdMatch = data.filter((j) => {
          return j.topic_id === ActiveTopicId;
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
};

// messege from server
socket.on("message", (message) => {
  for (let i = 0; i < message.length; i++) {
    outputMessage(message[i]);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  result.length = 0;

  messageHandler();

  // clear input form
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  setInterval(destroyHiddenMsg, 1000);
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute("data-msg-id", message.id);

  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);

  const topicActive = topicArr.filter((topic) => {
    return topic.dataset.state === "active";
  });
  const topic_id = parseInt(topicActive[0].dataset.id);

  if (message.topic_id === topic_id) {
    div.classList.add("show");
  } else {
    div.classList.add("hide");
  }

  dayjs.extend(window.dayjs_plugin_advancedFormat);
  const messageTime = dayjs(message.date_created).format(
    "MMMM Do YYYY, h:mm a"
  );

  div.innerHTML = `<p class="user-time">${message.user.user_name} <span>${messageTime}</span></p>
  <p class="text">${message.content}</p>`;
  chatMessages.appendChild(div);
}

const openChatMsg = (content) => {
  const div = document.createElement("div");
  div.classList.add("message");

  dayjs.extend(window.dayjs_plugin_advancedFormat);
  const messageTime = dayjs().format("MMMM Do YYYY, h:mm a");

  div.innerHTML = `<p class="user-time">Open Chat Box <span>${messageTime}</span></p>
  <p class="text">${content}</p>`;
  chatMessages.appendChild(div);
};

socket.on("server", (message) => openChatMsg(message));

const destroyHiddenMsg = () => {
  const messageEl = document.querySelectorAll(".chat-messages");

  const messageArr = Array.from(messageEl[0].children);

  const hiddenMessages = messageArr.filter((message) => {
    return message.classList[1] === "hide";
  });

  hiddenMessages.forEach((element) => element.remove());
};

const init = () => {
  topicList.innerHTML = "";
  getTopics().then((response) => response.forEach((item) => renderTopic(item)));
};

init();
