import "../styles/loading.css";

function Loading({ progress = 0, label = "Analyzing your GitHub data…" }) {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <h2 className="loading-title">DevMetric</h2>
        <p className="loading-subtitle">{label}</p>

        <div className="loading-bar-container">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="loading-percent">{progress}%</span>
      </div>
    </div>
  );
}

export default Loading;
