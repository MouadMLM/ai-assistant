🧠 AI Assistant Integration Widget

An embeddable AI assistant for websites and apps, built using Next.js (API route), HTML/CSS/JS frontend, and powered by OpenRouter.
🚀 Features

    Chat widget with toggle & close

    AI answers using OpenRouter API (e.g., Mistral model)

    Multi-language fallback (English, French, Arabic)

    Customizable system context

    Mobile-friendly

    Easy copy/paste integration on any website

📦 Project Structure

/public            → Static assets
/styles            → Chatbox styles
/pages/api/ask.js  → Backend API route
/index.html        → Example usage
/widget.js         → Main frontend logic

🛠 Requirements

    Vercel account (or any Node.js-compatible hosting)

    OpenRouter API Key → Get one

🔧 Setup Guide
1. Clone the repository

git clone https://github.com/MouadMLM/ai-assistant.git
cd ai-assistant

2. Install dependencies

npm install

3. Set up environment variables

Create a .env.local file:

API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

    Replace with your actual OpenRouter API key.

4. Deploy to Vercel

Use the Vercel CLI or push to GitHub and import the repo on vercel.com.
🧩 Integration in Any Website

Add the following to your HTML file before </body>:

<!-- Include the AI Assistant Widget -->
<link rel="stylesheet" href="https://your-domain.com/styles/chatbox.css" />
<div id="chat-box-wrapper">
  <!-- Chatbox will be injected here -->
</div>
<script src="https://your-domain.com/widget.js" defer></script>

    Replace your-domain.com with your actual Vercel or custom domain.

🧪 Example Context

The system prompt is customizable and can be changed in the JS frontend sendQuestion() call:

context: `You are an AI assistant specialized ONLY to answer about our service of creating and integrating AI assistants for websites and apps. ...`

🌐 Language Support

Supports fallback support messages in:

    English

    French

    Arabic

Easily extend with your own messages.
🤝 Need Help?

If you get stuck or want to customize this widget for your business:

📧 Contact: Mouadev at http://t.ly/_QWH8
📄 License

MIT — Free to use and modify.
