const API_KEY = "d408f9f71cf8462cbe7cbb9069f4b818";
const BASE_URL = "https://newsapi.org/v2/top-headlines";

export async function getNewsAPI(country, topic) {
  try {
    const url = `${BASE_URL}?country=${country}&category=${topic}&apiKey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("NewsAPI fetch failed");

    const data = await res.json();
    return (
      data.articles?.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: "NewsAPI",
        image: a.urlToImage,
      })) || []
    );
  } catch (err) {
    console.error("Error fetching from NewsAPI:", err);
    return [];
  }
}
