export default async function handler(req, res) {
    try {
  
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      // Safely parse body
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};
  
      console.log("REQUEST BODY:", body);
  
      const prompt = body.prompt || "";
      const systemInstruction = body.systemInstruction || "You are a helpful assistant.";
  
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
            model: "llama-3.3-70b-versatile",
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
  
      const text = data?.choices?.[0]?.message?.content || "";
  
      res.status(200).json({ text });
  
    } catch (error) {
      console.error("API ERROR:", error);
      res.status(500).json({ error: "AI request failed" });
    }
  }