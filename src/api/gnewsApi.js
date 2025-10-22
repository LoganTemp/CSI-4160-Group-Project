// src/api/gnewsApi.js

const API_KEY = "ec887e71140706ab5e391266b8857ee4";
const BASE_URL = "https://gnews.io/api/v4/top-headlines";

export async function getGNews(country, topic) {
  try {
    const url = `${BASE_URL}?token=${API_KEY}&lang=en&country=${country}&max=10&q=${topic}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GNews fetch failed");
    const data = await res.json();
    return (
      data.articles?.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: "GNews",
        image: a.image,
      })) || []
    );
  } catch (err) {
    console.error("Error fetching GNews:", err);
    return [];
  }
}
