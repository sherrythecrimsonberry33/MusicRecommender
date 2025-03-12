function RecommendationList({ recommendations }) {
    return (
      <div>
        <h2>Recommended Songs</h2>
        {recommendations.length === 0 ? (
          <p>No recommendations yet. Try searching!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recommendations.map((song, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                }}
              >
                {song}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  export default RecommendationList;
  