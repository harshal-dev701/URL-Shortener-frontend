import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

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
