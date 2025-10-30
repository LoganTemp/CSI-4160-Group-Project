import { useState } from "react";
import HomePage from "./HomePage";
import { getNews } from "./api/mediastackApi"; // Mediastack
import { getGuardianNews } from "./api/guardianApi"; // Guardian
import { getGNews } from "./api/gnewsApi"; // GNews
import { getNewsAPI } from "./api/newsApi"; // NewsAPI
import { getFactChecks } from "./api/factCheckApi"; // Factcheck Google
import { getGdeltNews } from "./api/gdeltApi"; // GDELT

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function App() {
  const [articles, setArticles] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate({ country, topic }) {
    setErrorMsg("");
    setSummary("");
    setLoading(true);

    try {
      const [mediastack, guardian, gnews, newsapi, factcheck, gdelt] =
        await Promise.all([
          getNews(country, topic),
          getGuardianNews(country, topic),
          getGNews(country, topic),
          getNewsAPI(country, topic),
          getFactChecks(topic),
          getGdeltNews(topic),
        ]);

      const allArticles = [
        ...mediastack,
        ...guardian,
        ...gnews,
        ...newsapi,
        ...factcheck,
        ...gdelt,
      ];

      const uniqueArticles = Array.from(
        new Map(allArticles.map((a) => [a.url, a])).values()
      );

      setArticles(uniqueArticles);

      const qs = new URLSearchParams({ country, topic }).toString();
      const res = await fetch(`${API_BASE}/api/summary?${qs}`);
      if (!res.ok) throw new Error(`summary fetch failed: ${res.status}`);
      const json = await res.json();
      setSummary(json.summary || "No summary available.");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        `Could not generate summary. Check backend on ${API_BASE} and browser console.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      {!articles ? (
        <HomePage onGenerate={handleGenerate} />
      ) : (
        <div>
          <button
            onClick={() => {
              setArticles(null);
              setSummary("");
              setErrorMsg("");
            }}
          >
            ← Back
          </button>

          {/* 🧠 Gemini Summary ABOVE Top News */}
          <div
            style={{
              marginTop: 24,
              background: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <h3 style={{ color: "#a020f0", marginTop: 0 }}>🧠 Gemini Summary</h3>
            {loading ? (
              <p>Generating summary…</p>
            ) : errorMsg ? (
              <p style={{ color: "#b91c1c" }}>{errorMsg}</p>
            ) : (
              <pre
                style={{
                  background: "#fff",
                  padding: "1em",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {summary || "No summary yet."}
              </pre>
            )}
          </div>

          <h2 style={{ marginTop: 24 }}>Top News (All Sources)</h2>
          {articles.length === 0 ? (
            <p>No news found for your selection.</p>
          ) : (
            <ul>
              {articles.map((a, i) => (
                <li key={i} style={{ marginBottom: 12 }}>
                  <a href={a.url} target="_blank" rel="noreferrer">
                    <strong>{a.title}</strong>
                  </a>
                  <p>{a.description}</p>
                  <small style={{ color: "#666" }}>
                    Source: {a.source}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
