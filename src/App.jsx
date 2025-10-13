import HomePage from "./HomePage.jsx";

export default function App() {
  const handleGenerate = async ({ country, topic }) => {
    // TODO: call your backend that talks to NewsAPI + Fact Check
    // Demo version (no backend yet):
    console.log("Selections:", { country, topic });
    alert(`Generating summary for:\nCountry: ${country}\nTopic: ${topic}`);

    // Example future call:
    // const res = await fetch(`/api/summary?country=${country}&topic=${topic}`);
    // const data = await res.json();
    // console.log(data);
  };

  return <HomePage onGenerate={handleGenerate} />;
}
