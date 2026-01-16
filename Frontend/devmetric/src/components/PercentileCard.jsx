import "../styles/percentilecard.css";

function PercentileCard({ percentiles }) {
  const percentileData = [
    {
      label: "Overall Ranking",
      value: percentiles?.overall || 72,
      description: "Based on all metrics"
    },
    {
      label: "Repository Count",
      value: percentiles?.repos || 65,
      description: "Compared to peers"
    },
    {
      label: "Commit Activity",
      value: percentiles?.commits || 78,
      description: "Your contribution level"
    },
    {
      label: "Language Diversity",
      value: percentiles?.languages || 70,
      description: "Tech stack breadth"
    }
  ];

  const getPercentileColor = (value) => {
    if (value >= 80) return "#22c55e"; // green
    if (value >= 60) return "#3b82f6"; // blue
    if (value >= 40) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="percentile-card">
      <h3 className="percentile-title">Your Percentile Rankings</h3>
      <p className="percentile-subtitle">How you compare to developers your age</p>
      
      <div className="percentile-list">
        {percentileData.map((item, index) => (
          <div key={index} className="percentile-item">
            <div className="percentile-header">
              <span className="percentile-label">{item.label}</span>
              <span 
                className="percentile-value"
                style={{ color: getPercentileColor(item.value) }}
              >
                {item.value}th
              </span>
            </div>
            <div className="percentile-bar-container">
              <div 
                className="percentile-bar"
                style={{ 
                  width: `${item.value}%`,
                  background: `linear-gradient(90deg, ${getPercentileColor(item.value)}, ${getPercentileColor(item.value)}dd)`
                }}
              ></div>
            </div>
            <p className="percentile-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PercentileCard;
