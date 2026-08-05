export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8001";

export const getShortUrl = (shortId) => `${API_BASE_URL}/url/${shortId}`;
