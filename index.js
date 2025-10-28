import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Base route for testing
app.get("/", (req, res) => {
  res.send("✅ SkillSnap backend is running!");
});

// 🧠 AI Summarization & Quiz Generation
app.post("/api/generate", async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "No content provided." });
  }

  try {
    // Summarize using Hugging Face free API
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
        timeout: 30000,
      }
    );

    const summary = hfResponse.data[0]?.summary_text || "Summary not generated.";

    // Generate 3 simple questions
    const sentences = summary.split(".").filter(s => s.trim() !== "");
    const questions = sentences.slice(0, 3).map((s, i) => ({
      q: `What is the key idea in: "${s.trim()}"?`,
      a: s.trim(),
    }));

    res.json({ summary, questions });
  } catch (err) {
    console.error("AI generation error:", err.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// 🔥 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
