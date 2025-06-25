export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct",
        messages: [{ role: "user", content: question }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter API error: ${text}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
