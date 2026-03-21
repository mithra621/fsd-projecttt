// @desc    Process live LLM chat queries
// @route   POST /api/chat
// @access  Private
const processChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message && !history) {
      return res.status(400).json({ reply: 'Please send a message or history.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback if user hasn't set up the API key yet
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.json({ 
        reply: "To unlock my full AI brain so I can answer literally ANY question, please get a free Gemini API Key from Google AI Studio (aistudio.google.com) and paste it into your `server/.env` file under `GEMINI_API_KEY=`! Restart the server and I'll be fully alive!"
      });
    }

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "You are an expert AI Interview Assistant for a platform called Interview Ace. You help software engineers prepare for technical and HR interviews, explain DSA, and provide resume feedback. If they ask for a mock interview, formally ask them technical questions one by one. Keep your answers concise, encouraging, and formatted with plain text or basic Markdown." }]
        },
        contents: req.body.history || [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: `API Error: ${data.error.message}` });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    res.json({ reply: botReply });
    
  } catch (error) {
    console.error("Backend LLM Chat Controller Crashed:", error);
    res.status(500).json({ reply: `Sorry, my AI core crashed: ${error.message}` });
  }
};

module.exports = { processChat };
