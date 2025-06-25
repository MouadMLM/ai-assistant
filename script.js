const toggleButton = document.getElementById("chat-toggle-button");
const chatBox = document.getElementById("chat-box");
const closeButton = document.getElementById("chat-close-button");
const languageSelect = document.getElementById("language-select");
const msgBox = document.getElementById("chat-messages");

const supportMessages = {
  en: "Sorry, I don't have the answer. Please contact support at support@aiassistant.com.",
  fr: "Désolé, je n'ai pas la réponse. Veuillez contacter le support à support@aiassistant.com.",
  ar: "عذراً، لا أملك الإجابة. يرجى التواصل مع الدعم عبر support@aiassistant.com."
};

const thinkingMessages = {
  en: "AI is thinking...",
  fr: "L'IA réfléchit...",
  ar: "الذكاء الاصطناعي يفكر..."
};

function getCurrentLanguage() {
  return languageSelect ? languageSelect.value : 'en';
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);
}

function scrollToBottom() {
  msgBox.scrollTop = msgBox.scrollHeight;
}

async function sendQuestion(question) {
  if (!question) return;

  const lang = getCurrentLanguage();

  msgBox.innerHTML += `<div class="question"><b>Vous:</b> ${escapeHtml(question)}</div>`;
  scrollToBottom();

  const thinkingEl = document.createElement("div");
  thinkingEl.id = "thinking";
  thinkingEl.style.fontStyle = "italic";
  thinkingEl.style.color = "#888";
  thinkingEl.textContent = thinkingMessages[lang] || thinkingMessages['en'];
  msgBox.appendChild(thinkingEl);
  scrollToBottom();

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        language: lang,
        context: `You are an AI assistant specialized ONLY to answer about our service of creating and integrating AI assistants for websites and apps. 
                  Give short, clear answers related ONLY to this service. 
                  If you don't know, reply with a short fallback support message.`
      })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      thinkingEl.remove();
      msgBox.innerHTML += `<div class="ai-answer"><b>AI-Assistant:</b> Server error. Please try again later.</div>`;
      scrollToBottom();
      return;
    }

    thinkingEl.remove();

    if (res.ok) {
      let answer = data.answer || "";
      
      answer = answer.replace(/https?:\/\/\S+/g, '');
      answer = answer.replace(/[^\w\s.,?!\-ء-ي@]/g, ''); // allow @ for emails

      if (answer.length > 200) {
        answer = answer.slice(0, 200) + '...';
      }

      const keywords = ['integration', 'service', 'assistant', 'website', 'app', 'create', 'support'];
      const hasKeywords = keywords.some(k => answer.toLowerCase().includes(k));

      if (!answer || !hasKeywords) {
        answer = supportMessages[lang] || supportMessages['en'];
      }

      msgBox.innerHTML += `<div class="ai-answer"><b>AI-Assistant:</b> ${escapeHtml(answer)}</div>`;
    } else {
      msgBox.innerHTML += `<div class="ai-answer"><b>AI-Assistant:</b> Error: ${escapeHtml(data.error || 'Unknown error')}</div>`;
    }
  } catch (error) {
    thinkingEl.remove();
    msgBox.innerHTML += `<div class="ai-answer"><b>AI-Assistant:</b> Error: ${escapeHtml(error.message)}</div>`;
  }

  scrollToBottom();
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    if (chatBox.style.display === "none" || chatBox.style.display === "") {
      chatBox.style.display = "block";
      toggleButton.style.display = "none";
    } else {
      chatBox.style.display = "none";
    }
  });
}

if (closeButton) {
  closeButton.addEventListener("click", () => {
    chatBox.style.display = "none";
    toggleButton.style.display = "block";
  });
}

document.querySelectorAll("#chat-quick-questions button").forEach(button => {
  button.addEventListener("click", () => {
    const question = button.dataset.q;
    sendQuestion(question);
  });
});

document.getElementById("chat-send-button").addEventListener("click", () => {
  const input = document.getElementById("chat-user-input");
  const question = input.value.trim();
  input.value = "";
  sendQuestion(question);
});

document.getElementById("chat-user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("chat-send-button").click();
  }
});

msgBox.addEventListener("click", (e) => {
  let target = e.target;
  if (target.tagName === "DIV") {
    let text = target.textContent;
    text = text.replace(/^You:\s*/i, '').replace(/^AI:\s*/i, '').trim();
    if (text) {
      const input = document.getElementById("chat-user-input");
      input.value = "";
      sendQuestion(text);
    }
  }
});
