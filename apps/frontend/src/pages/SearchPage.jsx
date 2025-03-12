import React, { useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommend?query=${query}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch recommendations");
      }

      setResults(data.recommendations);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl mb-4">🎵 Find Songs</h2>
      <input
        type="text"
        placeholder="Search by artist, song, or mood..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 mb-2 w-full max-w-md text-black"
      />
      <button onClick={handleSearch} className="bg-green-500 p-2 rounded">
        Search
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <ul className="mt-4">
        {results.map((song, index) => (
          <li key={index} className="p-2 border-b border-gray-600">{song}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
