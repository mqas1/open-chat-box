var createTopicBtn = document.getElementById("add-topic");
var topicList = document.querySelector("#topic-list");
var createTopic = document.getElementById("submitTopic");
var newTopicInput = document.getElementById("newTopicInput");


var topics = [];

function renderTopics() {
    // Clear todoList element and update todoCountSpan
    // topicList.innerHTML = "";
  
    // Render a new li for each todo
    // for (var i = 0; i < topics.length; i++) {
    //   var topic = topics[i];
  
      var li = document.createElement("li");
      li.textContent = newTopicInput.value;
    //   li.setAttribute("data-index", i);
  
    //   var button = document.createElement("button");
    //   button.textContent = "Topic name";
  
    //   li.appendChild(button);
      topicList.appendChild(li);
    };
  
// _________________________________________________________________
function newTopic() {

      var li = document.createElement("input");
      li.placeholder = "New topic name ..."

      var button = document.createElement("button");
      button.textContent = "Submit Topic";
  
      topicList.appendChild(li);
      topicList.appendChild(button);

    };
// _________________________________________________________________

var showBtn = document.querySelector(".showInput");

function showNewTopicBtn() {
    showBtn.className = "show"
  }

function hideNewTopicBtn() {
    showBtn.className = "hide"
  }  



createTopicBtn.addEventListener("click", function(event) {
    event.preventDefault();
    showNewTopicBtn();
    // renderLastGrade();
    });

createTopic.addEventListener("click", function(event) {
    event.preventDefault();
    renderTopics();
    hideNewTopicBtn()
    // renderLastGrade();
    });    

    

