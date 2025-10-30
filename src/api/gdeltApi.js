const BASE_URL = "https://api.gdeltproject.org/api/v2/doc/doc";

export async function getGdeltNews(topic) {
  try {
    const url = `${BASE_URL}?query=${encodeURIComponent(
      topic
    )}&mode=artlist&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GDELT fetch failed");

    const data = await res.json();
    return (
      data.articles?.map((a) => ({
        title: a.title,
        description: a.seendate || "No date",
        url: a.url,
        source: "GDELT",
      })) || []
    );
  } catch (err) {
    console.error("Error fetching GDELT news:", err);
    return [];
  }
}
