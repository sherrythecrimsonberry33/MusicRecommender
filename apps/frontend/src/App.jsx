import { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecommendationList from "./components/RecommendationList";

function App() {
  const [recommendations, setRecommendations] = useState([]);

  // Function to fetch recommendations from FastAPI backend
  const fetchRecommendations = async (query) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommend?query=${query}`);
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎵 AI Song Recommender</h1>
      <SearchBar onSearch={fetchRecommendations} />
      <RecommendationList recommendations={recommendations} />
    </div>
  );
}

export default App;
