const API_KEY = "ecf59bf3ac3d8a6fc7d6e5b74e14cea2"; 
const BASE_URL = "http://api.mediastack.com/v1/news";

export async function getNews(country, topic) {
  try {
    // If "any" topic selected, don't include category param
    const topicParam = topic && topic !== "any" ? `&categories=${topic}` : "";
    const url = `${BASE_URL}?access_key=${API_KEY}&countries=${country}&languages=en&limit=10${topicParam}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");

    const data = await res.json();
    return data.data || []; 
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
}