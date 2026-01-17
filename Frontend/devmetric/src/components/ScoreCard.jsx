// ScoreCard.jsx
import "../styles/scorecard.css";

function ScoreCard({ score = 72, maxScore = 100, percentiles = null }) {
  const percentage = (score / maxScore) * 100;

  // Determine color based on score - using design system colors
  let strokeColor;
  if (score / maxScore < 0.4) strokeColor = "#ef4444"; // error red
  else if (score / maxScore < 0.7) strokeColor = "#f59e0b"; // warning yellow
  else strokeColor = "#38bdf8"; // accent sky blue

  // Get percentile metrics with safe fallbacks
  const metricsData = [
    { label: "Repos", value: percentiles?.repos || 65, icon: "📦" },
    { label: "Commits", value: percentiles?.commits || 78, icon: "💾" },
    { label: "Languages", value: percentiles?.languages || 70, icon: "🔤" }
  ];

  return (
    <div className="score-card">
      <div className="score-display">
        <div className="score-number">{score}</div>
        <div className="score-max">/ {maxScore}</div>
      </div>

      <div className="score-content">
        <div className="score-header">
          <div className="score-label">DevMetric Score</div>
          <div className="score-percentile">
            <span className="score-percentile-icon">📈</span>
            Top {Math.round((1 - score/maxScore) * 100)}% of peers
          </div>
          <div className="score-subtitle">Age 18–22</div>
          <div className="score-footnote">Based on GitHub activity & project signals</div>
        </div>

        <div className="metrics-breakdown">
          {metricsData.map((metric, idx) => (
            <div key={idx} className="metric-item">
              <span className="metric-icon">{metric.icon}</span>
              <div className="metric-info">
                <span className="metric-value">{metric.value}</span>
                <span className="metric-name">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
