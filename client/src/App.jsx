import { useEffect, useState } from "react";

const HISTORY_STORAGE_KEY = "azelia_search_history";
const MAX_HISTORY_ITEMS = 5;

function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

function SearchHistory({ items, onUseHistory }) {
  if (items.length === 0) {
    return <p className="muted">No recent searches yet.</p>;
  }

  return (
    <div className="history-list">
      {items.map((item) => (
        <button
          key={item}
          className="history-chip"
          type="button"
          onClick={() => onUseHistory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function DataList({ items }) {
  if (items.length === 0) {
    return <p className="muted">No results found.</p>;
  }

  return (
    <ul className="result-list">
      {items.map((item) => (
        <li key={`${item.term}-${item.score}`} className="result-item">
          <span className="term">{item.term}</span>
          <span className="score">score: {item.score}</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [query, setQuery] = useState("productivity");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [cachedResponse, setCachedResponse] = useState(false);
  const [totalSearches, setTotalSearches] = useState(0);

  useEffect(() => {
    // Load history once when app starts.
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
      if (Array.isArray(stored)) {
        setHistory(stored.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const payload = await response.json();
      if (response.ok) {
        setTotalSearches(Number(payload.totalSearches || 0));
      }
    } catch {
      // Keep UI simple: if stats fails, keep current value.
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const saveHistory = (searchTerm) => {
    const normalized = searchTerm.trim();
    if (!normalized) {
      return;
    }

    const nextHistory = [
      normalized,
      ...history.filter((item) => item.toLowerCase() !== normalized.toLowerCase())
    ].slice(0, MAX_HISTORY_ITEMS);

    setHistory(nextHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  };

  const fetchData = async (searchTerm) => {
    const normalized = searchTerm.trim();
    if (!normalized) {
      setError("Please enter a search term.");
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/data?q=${encodeURIComponent(normalized)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Request failed");
      }

      setItems(payload.items || []);
      setCachedResponse(Boolean(payload.cached));
      saveHistory(normalized);
      loadStats();
    } catch (requestError) {
      setItems([]);
      setCachedResponse(false);
      setError(requestError.message || "Could not load data.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetchData(query);
  };

  const onUseHistory = (value) => {
    setQuery(value);
    fetchData(value);
  };

  useEffect(() => {
    // Run one default search on initial page load.
    fetchData("productivity");
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>Azelia Full-Stack Search</h1>
        <p className="muted">
          Frontend talks to Express backend, backend talks to external API.
        </p>

        <form className="search-form" onSubmit={onSubmit}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search term (example: focus, coding, design)"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="section-title">Search History (last 5)</div>
        <SearchHistory items={history} onUseHistory={onUseHistory} />

        <div className="section-title">Stats</div>
        <div className="stats-box">
          <div className="stats-row">
            <span><strong>Total searches:</strong> {totalSearches}</span>
            <button type="button" className="stats-btn" onClick={loadStats}>
              Refresh Stats
            </button>
          </div>
        </div>

        <div className="section-title">Results</div>

        {isLoading && (
          <div className="loading-row">
            <Spinner />
            <span>Loading data from backend...</span>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {!isLoading && !error && (
          <>
            {cachedResponse && <div className="cache-note">Showing cached data (60s cache)</div>}
            <DataList items={items} />
          </>
        )}
      </section>
    </main>
  );
}
