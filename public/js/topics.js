const createTopicBtn = document.getElementById("add-topic");
const topicList = document.querySelector("#topic-list");
const createTopic = document.getElementById("submitTopic");
const newTopicInput = document.getElementById("newTopicInput");
const showBtn = document.querySelector(".showInput");
const chatMessages = document.querySelector(".chat-messages");

const getTopics = () => 
  fetch("/api/topics", {
    method: "GET"
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
}

function showNewTopicBtn() {
  showBtn.className = "show"
}

function hideNewTopicBtn() {
  showBtn.className = "hide"
}

const newTopic = async () => {
  const topic_name = document.querySelector("#newTopicInput").value.trim();
  if (topic_name) {
    const response = await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({
        topic_name: topic_name
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      socketsTopic();
    } else {
      console.log("Failed to create new topic");
    }
  }
}

const socketsTopic = async () => {
  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);
  const resultArr = [];

  const topicIDArr = topicArr.map((x) => parseInt(x.dataset.id));
  
  await fetch("/api/topics", {
    method: "GET"
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
          
        socket.on("topic", (topic) => topic.forEach((x) => renderTopic(x)));
      });
    }
  })
  .catch((err) => console.log(err));
}

createTopicBtn.addEventListener("click", function(event) {
  event.preventDefault();
  showNewTopicBtn();
});

createTopic.addEventListener("click", function(event) {
  event.preventDefault();
  newTopic();
  hideNewTopicBtn();
});

const topicsListHandler = (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.dataset.id;

    fetch("/api/messages", {
      method: "GET"
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
}

const renderMessages = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute("data-msg-id", message.id);

  dayjs.extend(window.dayjs_plugin_advancedFormat);
  const messageTime = dayjs(message.date_created).format("MMMM Do YYYY, h:mm a");

  div.innerHTML = `<p class="user-time">${message.user.user_name} <span>${messageTime}</span></p>
  <p class="text">${message.content}</p>`;
  chatMessages.appendChild(div);
}

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
}

topicList.addEventListener("click", function(event){
  event.preventDefault();
  chatMessages.innerHTML = "";
  topicsListHandler(event);
  compareDataState(event);
});

const init = () => {
  topicList.innerHTML = "";
  getTopics().then((response) => response.forEach((item) => renderTopic(item)));
};

init();