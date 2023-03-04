const createTopicBtn = document.getElementById("add-topic");
const topicList = document.querySelector("#topic-list");
const createTopic = document.getElementById("submitTopic");
const newTopicInput = document.getElementById("newTopicInput");
const showBtn = document.querySelector(".showInput");
// const socket = io();

const getTopics = () => 
  fetch("/api/topics", {
    method: "GET"
  })
    .then((res) => res.json())
    .then((data) => data);

const renderTopic = (topic) => {
  const liEl = document.createElement("li");
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
      console.log(response);
    } else {
      console.log("Failed to create new topic");
    }
  }
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

const init = () => {
  topicList.innerHTML = "";
  getTopics().then((response) => response.forEach((item) => renderTopic(item)));
};
    
init();