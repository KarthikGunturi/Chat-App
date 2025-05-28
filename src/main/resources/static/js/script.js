let stompClient = null;
let name = null;

const connect = () => {
  const socket = new SockJS("/server1");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-room").style.display = "flex";
    document.getElementById("user-name").textContent = name;

    stompClient.subscribe("/topic/return-to", (message) => {
      const data = JSON.parse(message.body);
      showMessage(data);
    });
  });
};

const showMessage = (data) => {
  const isSent = data.name === name;
  addMessageToUI(data.name, data.content, isSent);
};

const addMessageToUI = (sender, content, isSent) => {
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isSent ? "sent" : "received");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${content}`;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Events

document.getElementById("login").addEventListener("click", () => {
  const inputName = document.getElementById("name-value").value.trim();
  if (!inputName) return alert("Please enter your name");
  name = inputName;
  connect();
});

document.getElementById("send-btn").addEventListener("click", () => {
  const content = document.getElementById("message-value").value.trim();
  if (!content) return;
  const payload = JSON.stringify({ name, content });
  stompClient.send("/app/message", {}, payload);
  document.getElementById("message-value").value = "";
});

document.getElementById("logout").addEventListener("click", () => {
  if (stompClient) stompClient.disconnect();
  document.getElementById("chat-room").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("message-container").innerHTML = "";
  name = null;
});
// ...existing code...


// Send AI query
document.getElementById("ai-send-btn").addEventListener("click", () => {
  const question = document.getElementById("message-value").value.trim();
  if (!question) return;
  addMessageToUI(name, question, true);
  document.getElementById("message-value").value = "";
  fetch("/api/ai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  })
      .then((res) => res.text())
      .then((answer) => {
        addMessageToUI("AI", answer, false);
        document.getElementById("ai-box").style.display = "none";
        document.getElementById("ai-query").value = "";
      })
      .catch((err) => console.error("AI error:", err));
});
