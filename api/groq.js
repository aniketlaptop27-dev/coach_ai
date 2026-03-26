export default async function handler(req, res) {
    const { prompt, systemInstruction } = req.body;
  
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

console.log("GROQ RAW RESPONSE:", data);

let text = "";

if (data.choices && data.choices.length > 0) {
  if (data.choices[0].message && data.choices[0].message.content) {
    text = data.choices[0].message.content;
  } else if (data.choices[0].text) {
    text = data.choices[0].text;
  }
}

res.status(200).json({ text });
  }