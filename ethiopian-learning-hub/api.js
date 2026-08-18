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
    console.log("📥 Incoming Request Prompt text:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt payload is missing." });
    }

    const targetUrl = "https://googleapis.com";

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey.trim(),
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
    console.log(
      "📡 Raw Response JSON Structure from Google:",
      JSON.stringify(data),
    );

    if (!response.ok) {
      console.error("❌ Google Cloud API Error Object Payload:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Google Cloud Authentication Failure",
      });
    }

    // FIXED PARSING CHAIN: Explicitly drills into array targets using index values [0]
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
        "The AI processed the request but returned an empty structural object grid configuration node.";
    }

    console.log("📤 Sending clean text response back to student:", aiText);
    res.json({ text: aiText });
  } catch (error) {
    console.error("💥 Critical Backend System Proxy Exception Log:", error);
    res
      .status(500)
      .json({ error: "Server connection failed: " + error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Ethiopian Learning Hub API Proxy Engine active on http://localhost:${PORT}`,
  );
});
