
  // Toggle chat visibility (make sure you have #chat-toggle-button somewhere)
  const toggleButton = document.getElementById("chat-toggle-button");
  const chatBox = document.getElementById("chat-box");

  if(toggleButton) {
    toggleButton.addEventListener("click", () => {
      chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    });
  }

  // Quick question click: set input value
  document.querySelectorAll("#chat-quick-questions button").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("chat-user-input").value = button.dataset.q;
    });
  });

  // Send question to API and update chat
  document.getElementById("chat-send-button").addEventListener("click", async () => {
  const input = document.getElementById("chat-user-input");
  const question = input.value.trim();
  if (!question) return;

  const msgBox = document.getElementById("chat-messages");
  msgBox.innerHTML += `<div><b>You:</b> ${question}</div>`;
  input.value = "";
  msgBox.scrollTop = msgBox.scrollHeight;

  try {
    const answer = await askQuestion(question);
    msgBox.innerHTML += `<div><b>AI:</b> ${answer}</div>`;
  } catch (error) {
    msgBox.innerHTML += `<div><b>AI:</b> Error: ${error.message}</div>`;
  }
  msgBox.scrollTop = msgBox.scrollHeight;
});
    // Append user message
    msgBox.innerHTML += `<div><b>You:</b> ${message}</div>`;
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      // Call your backend API
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });
      const data = await res.json();

      if (res.ok) {
        msgBox.innerHTML += `<div><b>AI:</b> ${data.answer}</div>`;
      } else {
        msgBox.innerHTML += `<div><b>AI:</b> Error: ${data.error}</div>`;
      }
    } catch (error) {
      msgBox.innerHTML += `<div><b>AI:</b> Error: ${error.message}</div>`;
    }

    msgBox.scrollTop = msgBox.scrollHeight;
  });

  // Optional: Enter key sends the question
  document.getElementById("chat-user-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("chat-send-button").click();
    }
  });

