import { useState } from "react";
import HomePage from "./HomePage";
import { getNews } from "./api/mediastackApi"; // Mediastack
import { getGuardianNews } from "./api/guardianApi"; // Guardian
import { getGNews } from "./api/gnewsApi"; // GNews
import { getNewsAPI } from "./api/newsApi"; // NewsAPI
import { getFactChecks } from "./api/factCheckApi"; // Factcheck Google
import { getGdeltNews } from "./api/gdeltApi"; // GDELT
import "./App.css";

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
      // fetch from ALL sources in parallel
      const [mediastack, guardian, gnews, newsapi, factcheck, gdelt] =
        await Promise.all([
          getNews(country, topic),
          getGuardianNews(country, topic),
          getGNews(country, topic),
          getNewsAPI(country, topic),
          getFactChecks(topic),
          getGdeltNews(topic),
        ]);

      // combine and dedupe by URL
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

      // ask backend (Gemini) for summary
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
    <div className="results-page">
      {!articles ? (
        <HomePage onGenerate={handleGenerate} />
      ) : (
        <div className="results-container">
          <button
            className="back-btn"
            onClick={() => {
              setArticles(null);
              setSummary("");
              setErrorMsg("");
            }}
          >
            ← Back
          </button>

          {/* Gemini Summary */}
          <div className="summary-card">
            <h3 className="summary-title">🧠 Gemini Summary</h3>

            {loading ? (
              <p className="loading">Generating summary…</p>
            ) : errorMsg ? (
              <p className="error-text">{errorMsg}</p>
            ) : (
              <pre className="summary-pre">{summary || "No summary yet."}</pre>
            )}
          </div>

          <h2 className="news-header">Top News (All Sources)</h2>

          {articles.length === 0 ? (
            <p className="no-news">No news found for your selection.</p>
          ) : (
            <ul className="news-list">
              {articles.map((a, i) => (
                <li key={i} className="news-item">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-link"
                  >
                    <strong>{a.title}</strong>
                  </a>
                  <p className="news-description">{a.description}</p>
                  <small className="news-source">Source: {a.source}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
