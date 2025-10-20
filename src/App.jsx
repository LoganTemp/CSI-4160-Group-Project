import { useState } from "react";
import HomePage from "./HomePage";
import { getNews } from "./api/newsApi";

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
      // 1) Fetch news (your existing function)
      const data = await getNews(country, topic);
      setArticles(Array.isArray(data) ? data : []);

      // 2) Ask backend for Gemini summary
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
          <button onClick={() => { setArticles(null); setSummary(""); setErrorMsg(""); }}>
            ← Back
          </button>

          <h2 style={{ marginTop: 16 }}>Top News</h2>
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
                  <small>{a.source}</small>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 24 }}>
            <h3>🧠 Gemini Summary</h3>
            {loading ? (
              <p>Generating summary…</p>
            ) : errorMsg ? (
              <p style={{ color: "#b91c1c" }}>{errorMsg}</p>
            ) : (
              <pre
                style={{
                  background: "#f9f9f9",
                  padding: "1em",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {summary || "No summary yet."}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
