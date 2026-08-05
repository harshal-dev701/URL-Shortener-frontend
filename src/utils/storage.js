const HISTORY_KEY = "url-shortener-history";
const MAX_HISTORY = 10;

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry) {
  const history = getHistory().filter((item) => item.shortId !== entry.shortId);
  history.unshift({ ...entry, createdAt: Date.now() });
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, MAX_HISTORY))
  );
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
