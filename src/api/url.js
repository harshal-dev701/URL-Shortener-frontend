import api from "./auth";

export async function shortenUrl(url) {
  const { data } = await api.post("/url", { url });
  return data;
}

export async function getAnalytics(shortId) {
  const { data } = await api.get(`/url/analytics/${shortId}`);
  return data;
}

export async function unshortenUrl(url) {
  const { data } = await api.post("/url/unshorten", { url });
  return data;
}
