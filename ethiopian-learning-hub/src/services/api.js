import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Official AQ-prefix format Google AI Studio Token Key
// Replace your hardcoded key string with this:
const apiKey = import.meta.env.VITE_GCP_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("📥 Incoming Prompt Text:", prompt);

    if (!prompt) {
      return res
        .status(400)
        .json({ error: "Prompt text parameter is missing." });
    }

    const targetUrl = "https://googleapis.com" + apiKey.trim();

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [
            {
              text: "You are the master AI Educational Coordinator and Tech Mentor for the Ethiopian Learning Hub. Provide clear, simple code explanations and programming tips tailored for students.",
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Google Cloud API Error Data:", JSON.stringify(data));
      return res.status(response.status).json({
        error: data.error?.message || "Google Cloud Authentication Failure",
      });
    }

    // THE DEFINITIVE ARRAY INDEX TRAVERSAL PATH FIX
    let aiText = "";
    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      aiText = data.candidates[0].content.parts[0].text;
    }

    if (!aiText) {
      aiText =
        "The AI processed the request but returned an empty structural layout node tree configuration.";
    }

    console.log("📤 Array parsed cleanly. Sending response text to frontend.");
    res.json({ text: aiText });
  } catch (error) {
    console.error("💥 Critical Backend System Proxy Exception Log:", error);
    res
      .status(500)
      .json({ error: "Server structural processing failed: " + error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Ethiopian Learning Hub API Proxy Engine active on http://localhost:${PORT}`,
  );
});
