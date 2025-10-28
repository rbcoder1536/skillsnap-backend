import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ SkillSnap backend is running!");
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
