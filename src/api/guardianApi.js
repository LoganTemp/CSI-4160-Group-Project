const API_KEY = "0403637b-bcf9-4be1-bd24-5285a845b56a";
const BASE_URL = "https://content.guardianapis.com/search";

export async function getGuardianNews(country, topic ) {
  try {
    const url = `${BASE_URL}?api-key=${API_KEY}&q=${topic}&page-size=10&show-fields=trailText,short-url,thumbnail`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Guardian fetch failed");

    const data = await res.json();

    if (!data.response || !data.response.results) return [];

    return data.response.results.map((a) => ({
      title: a.webTitle,
      description: a.fields?.trailText || "No description",
      url: a.webUrl,
      source: "The Guardian",
      image: a.fields?.thumbnail || "",
    }));
  } catch (err) {
    console.error("Error fetching Guardian news:", err);
    return [];
  }
}
