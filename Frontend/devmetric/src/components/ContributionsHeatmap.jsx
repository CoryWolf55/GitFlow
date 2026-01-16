import "../styles/contributionsheatmap.css";
import { useEffect, useState } from "react";

function ContributionsHeatmap({ contributions }) {
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    // Generate mock data for 90 days if no data provided
    if (!contributions || contributions.length === 0) {
      const mockData = generateMockContributions(90);
      setWeeks(organizeIntoWeeks(mockData));
    } else {
      setWeeks(organizeIntoWeeks(contributions));
    }
  }, [contributions]);

  const generateMockContributions = (days) => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10)
      });
    }
    return data;
  };

  const organizeIntoWeeks = (data) => {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    return weeks.reverse(); // Most recent week last
  };

  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  const getIntensityClass = (count) => {
    const intensity = getIntensity(count);
    return `heatmap-day intensity-${intensity}`;
  };

  const totalContributions = weeks.flat().reduce((sum, day) => sum + (day.count || 0), 0);

  return (
    <div className="contributions-heatmap-card">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Contributions</h3>
        <div className="heatmap-stats">
          <span className="heatmap-total">{totalContributions} contributions</span>
          <span className="heatmap-period">in the last 90 days</span>
        </div>
      </div>
      
      <div className="heatmap-container">
        <div className="heatmap-months">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
            <span key={month} className="heatmap-month-label">{month}</span>
          ))}
        </div>
        
        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={getIntensityClass(day.count)}
                  title={`${day.date}: ${day.count} contributions`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Less</span>
          <div className="heatmap-legend-squares">
            <div className="heatmap-day intensity-0"></div>
            <div className="heatmap-day intensity-1"></div>
            <div className="heatmap-day intensity-2"></div>
            <div className="heatmap-day intensity-3"></div>
            <div className="heatmap-day intensity-4"></div>
          </div>
          <span className="heatmap-legend-label">More</span>
        </div>
      </div>
    </div>
  );
}

export default ContributionsHeatmap;
