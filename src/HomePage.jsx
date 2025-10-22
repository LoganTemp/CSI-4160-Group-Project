import { useState } from "react";

const COUNTRY_OPTIONS = [
  { code: "", name: "Select a country" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "jp", name: "Japan" },
  { code: "za", name: "South Africa" },
];

const TOPIC_OPTIONS = [
  { key: "", label: "Select a topic" },
  { key: "any", label: "Any" },
  { key: "business", label: "Business" },
  { key: "entertainment", label: "Entertainment" },
  { key: "general", label: "General" },
  { key: "health", label: "Health" },
  { key: "science", label: "Science" },
  { key: "sports", label: "Sports" },
  { key: "technology", label: "Technology" },
];

export default function HomePage({ onGenerate }) {
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!country) return setError("Please select a country.");
    if (!topic) return setError("Please select a topic (choose 'Any' if you want everything).");
    setError("");
    if (typeof onGenerate === "function") onGenerate({ country, topic });
    else alert(`Country: ${country}\nTopic: ${topic}`);
  };

  const reset = () => {
    setCountry("");
    setTopic("");
    setError("");
  };

  // simple inline styles so it’s visible even without Tailwind
  const box = { maxWidth: 720, margin: "40px auto", padding: 24, borderRadius: 16, border: "1px solid #ddd" };
  const row = { display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, alignItems: "center" };
  const select = { padding: "10px 12px", fontSize: 14 };
  const btn = { padding: "10px 16px", fontWeight: 700, cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc" }}>
      <div style={box}>
        <h1 style={{ marginTop: 0 }}>NewsFusion — Fact-Checked Summaries</h1>
        <p style={{ color: "#555" }}>
          Pick a country and topic, then generate a concise summary with sources.
        </p>

        <form onSubmit={submit}>
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            <div style={row}>
              <label>Country</label>
              <select style={select} value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={row}>
              <label>Topic</label>
              <select style={select} value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPIC_OPTIONS.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div style={{ color: "#c53030", marginTop: 10 }}>{error}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="submit" style={{ ...btn, background: "#4f46e5", color: "#fff", border: "none" }}>
              Generate summary
            </button>
            <button type="button" onClick={reset} style={{ ...btn, background: "#fff", border: "1px solid #cbd5e0" }}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
