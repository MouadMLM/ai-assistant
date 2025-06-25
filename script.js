// Toggle chat visibility (make sure you have #chat-toggle-button somewhere)
const toggleButton = document.getElementById("chat-toggle-button");
const chatBox = document.getElementById("chat-box");

if (toggleButton) {
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

// Main send handler
document.getElementById("chat-send-button").addEventListener("click", async () => {
  const input = document.getElementById("chat-user-input");
  const question = input.value.trim();
  if (!question) return;

  const msgBox = document.getElementById("chat-messages");

  // Add user message
  msgBox.innerHTML += `<div><b>You:</b> ${escapeHtml(question)}</div>`;
  input.value = "";
  msgBox.scrollTop = msgBox.scrollHeight;

  // Show thinking indicator
  const thinkingEl = document.createElement("div");
  thinkingEl.id = "thinking";
  thinkingEl.style.fontStyle = "italic";
  thinkingEl.style.color = "#888";
  thinkingEl.textContent = "AI is thinking...";
  msgBox.appendChild(thinkingEl);
  msgBox.scrollTop = msgBox.scrollHeight;

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await res.json();

    // Remove thinking
    thinkingEl.remove();

    if (res.ok) {
      // Show AI answer (short and promo-limited should be handled by /api/ask)
      msgBox.innerHTML += `<div><b>AI:</b> ${escapeHtml(data.answer)}</div>`;
    } else {
      msgBox.innerHTML += `<div><b>AI:</b> Error: ${escapeHtml(data.error)}</div>`;
    }
  } catch (error) {
    thinkingEl.remove();
    msgBox.innerHTML += `<div><b>AI:</b> Error: ${escapeHtml(error.message)}</div>`;
  }

  msgBox.scrollTop = msgBox.scrollHeight;
});

// Optional: Enter key sends the question
document.getElementById("chat-user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("chat-send-button").click();
  }
});

// Simple HTML escape to avoid injection
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return {
      '&': "&amp;",
      '<': "&lt;",
      '>': "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}
