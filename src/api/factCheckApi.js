// src/api/factCheckApi.js
const API_KEY = "AIzaSyB2V0D4RJjXRkWaznBpUNyJQM66uLa4zY0";
const BASE_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search";

export async function getFactChecks(topic) {
  try {
    const url = `${BASE_URL}?query=${encodeURIComponent(topic)}&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fact Check fetch failed");

    const data = await res.json();
    return (
      data.claims?.map((claim) => ({
        title: claim.text || "No title",
        description:
          claim.claimReview?.[0]?.textualRating ||
          claim.claimReview?.[0]?.title ||
          "No details available",
        url: claim.claimReview?.[0]?.url,
        source: "Google Fact Check",
      })) || []
    );
  } catch (err) {
    console.error("Error fetching Fact Checks:", err);
    return [];
  }
}
