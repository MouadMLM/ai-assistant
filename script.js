const toggleButton = document.getElementById("chat-toggle-button");
const chatBox = document.getElementById("chat-box");

// URLs for icons
const robotIconUrl = "https://www.creativefabrica.com/wp-content/uploads/2023/02/21/Yellow-robot-chatbot-icon-design-Graphics-61955630-2-580x387.png";
const closeIconUrl = "https://cdn-icons-png.freepik.com/256/5652/5652954.png?semt=ais_hybrid";

if (toggleButton) {
  // Initialize with robot icon or close icon depending on chat visibility
  if (chatBox.style.display === "block") {
    toggleButton.innerHTML = `<img src="${closeIconUrl}" alt="Close" style="width:100px; height:100px;">`;
  } else {
    toggleButton.innerHTML = `<img src="${robotIconUrl}" alt="Chatbot" style="width:200px; height:200px;">`;
  }

  toggleButton.addEventListener("click", () => {
    if (chatBox.style.display === "none" || chatBox.style.display === "") {
      chatBox.style.display = "block";
      toggleButton.innerHTML = `<img src="${closeIconUrl}" alt="Close" style="width:200px; height:200px;">`;
    } else {
      chatBox.style.display = "none";
      toggleButton.innerHTML = `<img src="${robotIconUrl}" alt="Chatbot" style="width:200px; height:200px;">`;
    }
  });
}
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

const languageSelect = document.getElementById("language-select");

function getCurrentLanguage() {
  return languageSelect ? languageSelect.value : 'en';
}

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

async function sendQuestion(question) {
  if (!question) return;

  const msgBox = document.getElementById("chat-messages");
  const lang = getCurrentLanguage();

  msgBox.innerHTML += `<div><b>You:</b> ${escapeHtml(question)}</div>`;
  msgBox.scrollTop = msgBox.scrollHeight;

  const thinkingEl = document.createElement("div");
  thinkingEl.id = "thinking";
  thinkingEl.style.fontStyle = "italic";
  thinkingEl.style.color = "#888";
  thinkingEl.textContent = thinkingMessages[lang] || thinkingMessages['en'];
  msgBox.appendChild(thinkingEl);
  msgBox.scrollTop = msgBox.scrollHeight;

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        language: lang,
        context: `You are an AI assistant specialized ONLY to ansewer about our service of  creating and integrating AI assistants for websites and apps. 
                  Give short, clear answers related ONLY to this service. 
                  If you don't know, reply with a short fallback support message.`
      })
    });

    const data = await res.json();

    thinkingEl.remove();

    if (res.ok) {
      let answer = data.answer || "";
      
      answer = answer.replace(/https?:\/\/\S+/g, '');
      answer = answer.replace(/[^\w\s.,?!\-ء-ي]/g, '');

      if (answer.length > 200) {
        answer = answer.slice(0, 200) + '...';
      }

      const keywords = ['integration', 'service', 'assistant', 'website', 'app', 'create', 'support'];
      const hasKeywords = keywords.some(k => answer.toLowerCase().includes(k));

      if (!answer || !hasKeywords) {
        answer = supportMessages[lang] || supportMessages['en'];
      }

      msgBox.innerHTML += `<div><b>AI:</b> ${escapeHtml(answer)}</div>`;
    } else {
      msgBox.innerHTML += `<div><b>AI:</b> Error: ${escapeHtml(data.error)}</div>`;
    }
  } catch (error) {
    thinkingEl.remove();
    msgBox.innerHTML += `<div><b>AI:</b> Error: ${escapeHtml(error.message)}</div>`;
  }

  msgBox.scrollTop = msgBox.scrollHeight;
}

document.querySelectorAll("#chat-quick-questions button").forEach(button => {
  button.addEventListener("click", () => {
    const question = button.dataset.q;
    document.getElementById("chat-user-input").value = question;
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

const msgBox = document.getElementById("chat-messages");
msgBox.addEventListener("click", (e) => {
  let target = e.target;
  if (target.tagName === "DIV") {
    let text = target.textContent;
    text = text.replace(/^You:\s*/, '').replace(/^AI:\s*/, '').trim();
    if (text) {
      const input = document.getElementById("chat-user-input");
      input.value = ""; 
      sendQuestion(text);
    }
  }
});

