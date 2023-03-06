const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const socket = io();

const messageHandler = async() => {
  const content = document.querySelector("#msg").value.trim();
  
  const topicListLiEl = document.querySelectorAll(".topic-list-li");
  const topicArr = Array.from(topicListLiEl);
  
  const topicActive = topicArr.filter((topic) => {
    return topic.dataset.state === "active";
  });
  const topic_id = parseInt(topicActive[0].dataset.id);

  if (content, topic_id) {
    const response = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        content: content,
        topic_id: topic_id
      }),
      headers: {
        "Content-type": "application/json"
      }
    });

    if (response.ok) {
      console.log(response);
    } else {
      console.log("Failed to create new message");
    }
  }
}

// messege from server
// socket.on("message", (message) => {
//   console.log(message);
//   outputMessage(message);
//   // scroll down
//   chatMessage.scrollTop = chatMessage.scrollHeight;
// });

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Getting the text message
  // const msg = e.target.elements.msg.value;

  // emit message to the server
  // socket.emit("chatMessage", msg);
  messageHandler();

  // clear input form
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();

  // if (!msg) {
  //   return false;
  // }
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="user-time">${message.userName} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
