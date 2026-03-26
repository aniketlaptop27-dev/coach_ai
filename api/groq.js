export default async function handler(req, res) {
    try {
  
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};
  
      const prompt = body.prompt || "";
      const systemInstruction = body.systemInstruction || "You are a helpful AI assistant.";
  
      if (!prompt) {
        return res.status(400).json({ error: "Prompt missing" });
      }
  
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
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
  
      if (data?.choices?.length > 0) {
        const choice = data.choices[0];
  
        if (choice.message?.content) {
          text = choice.message.content;
        } else if (choice.text) {
          text = choice.text;
        }
      }
  
      return res.status(200).json({ text });
  
    } catch (error) {
      console.error("GROQ ERROR:", error);
      return res.status(500).json({ error: "AI generation failed" });
    }
  }