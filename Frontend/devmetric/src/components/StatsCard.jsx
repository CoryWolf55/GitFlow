import "../styles/statscard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function StatsCard({ icon, label, value, color }) {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ color: color }}>
        <i className={icon}></i>
      </div>
      <div className="stats-content">
        <div className="stats-value">{value.toLocaleString()}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
}

export default StatsCard;
