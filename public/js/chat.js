const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-message");
const socket = io();

// messege from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  // scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Getting the text message
  const msg = e.target.elements.msg.value;
  // emit message to the server
  socket.emit("chatMessage", msg);

  // clear input form
  e.target.elements.msg.value = " ";
  e.target.elements.msg.focus();

  // console.log(msg);
});
// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `${message}`;
  document.querySelector(".chat-message").appendChild(div);
}
