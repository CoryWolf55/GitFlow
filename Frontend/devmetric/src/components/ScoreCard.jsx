// ScoreCard.jsx
import "../styles/scorecard.css";

function ScoreCard({ score = 100, maxScore = 100 }) {
  const percentage = (score / maxScore) * 100;

  // Determine color based on score - using design system colors
  let strokeColor;
  if (score / maxScore < 0.4) strokeColor = "#ef4444"; // error red
  else if (score / maxScore < 0.7) strokeColor = "#f59e0b"; // warning yellow
  else strokeColor = "#38bdf8"; // accent sky blue

  return (
    <div className="score-card">
      <div className="circle-wrapper">
        <svg className="progress-circle" viewBox="0 0 36 36">
          <path
            className="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle-progress"
            stroke={strokeColor}
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="score-text">
          <span>{score}</span>
          <small>/ {maxScore}</small>
        </div>
      </div>
      <div className="score-label">DevMetric Score</div>
    </div>
  );
}

export default ScoreCard;
