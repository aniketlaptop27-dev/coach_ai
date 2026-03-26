  export default async function handler(req, res) {

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;
  
    const prompt = body.prompt;
    const systemInstruction = body.systemInstruction;
  
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });
  
    const data = await response.json();

console.log("GROQ RESPONSE:", data);

let text = "";

if (data && data.choices && data.choices.length > 0) {
  const choice = data.choices[0];

  if (choice.message && choice.message.content) {
    text = choice.message.content;
  } else if (choice.text) {
    text = choice.text;
  }
}

res.status(200).json({ text });
  
  }