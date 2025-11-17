import { useState } from "react";
import "./HomePage.css";

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
    if (!topic)
      return setError(
        "Please select a topic (choose 'Any' if you want everything)."
      );
    setError("");
    if (typeof onGenerate === "function") onGenerate({ country, topic });
    else alert(`Country: ${country}\nTopic: ${topic}`);
  };

  const reset = () => {
    setCountry("");
    setTopic("");
    setError("");
  };

  return (
    <div className="page">
      <div className="box">
        <h1>NewsFusion - Fact-Checked Summaries</h1>
        <p className="subtitle">
          Pick a country and topic, then generate a concise summary with
          sources.
        </p>

        <form onSubmit={submit}>
          <div className="grid">
            <div className="row">
              <label>Country</label>
              <select
                className="select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <label>Topic</label>
              <select
                className="select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="button-row">
            <button type="submit" className="btn primary">
              Generate summary
            </button>
            <button type="button" className="btn secondary" onClick={reset}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
