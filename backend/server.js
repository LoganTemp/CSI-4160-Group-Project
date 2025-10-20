// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allow frontend to connect
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ✅ Log every request (for debugging)
app.use((req, _res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ✅ Pick model (set in .env or defaults to gemini-2.0-flash)
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// --- Test Route ---
app.get("/api/test", async (_req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const r = await model.generateContent("Say 'Connected!'");
    const response = r.response.text();
    console.log("✅ Gemini connected:", response);
    res.json({ success: true, response, model: MODEL });
  } catch (e) {
    console.error("❌ /api/test error:", e);
    res.status(500).json({ success: false, error: e.message, model: MODEL });
  }
});

// --- Summary Route ---
app.get("/api/summary", async (req, res) => {
  const { country = "us", topic = "any" } = req.query;
  console.log("🧠 /api/summary inputs:", { country, topic });

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
      Provide a concise 3–5 sentence summary of the most recent "${topic}" news in ${country}.
      Keep it neutral, factual, and clearly structured. Include any major global events or themes.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🧠 Gemini summary (first 120 chars):", text.slice(0, 120), "…");
    res.json({ ok: true, summary: text, model: MODEL });
  } catch (e) {
    console.error("❌ /api/summary error:", e);
    res.status(500).json({ ok: false, error: e.message, model: MODEL });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Routes: GET /api/test, GET /api/summary (model: ${MODEL})`);
});
