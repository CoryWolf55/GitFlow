import "../styles/contributionsheatmap.css";
import { useEffect, useState } from "react";

function ContributionsHeatmap({ contributions }) {
  const [weeks, setWeeks] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);

  useEffect(() => {
    let dataToUse = contributions && contributions.length > 0 ? contributions : generateMockContributions(90);

    // Keep only the last 90 days
    const sorted = [...dataToUse].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last90Days = sorted.slice(-90);

    const weeksArr = organizeIntoWeeks(last90Days);
    setWeeks(weeksArr);
    setMonthLabels(generateMonthLabels(weeksArr));
  }, [contributions]);

  // Mock data generator
  const generateMockContributions = (days) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10),
      });
    }
    return data;
  };

  const organizeIntoWeeks = (data) => {
    const weeks = [];
    let currentWeek = [];
    data.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  // Generate month labels aligned to week columns
  const generateMonthLabels = (weeks) => {
    const labels = [];
    let lastMonth = "";
    weeks.forEach((week, idx) => {
      const firstDay = week[0];
      const month = new Date(firstDay.date).toLocaleString('default', { month: 'short' });
      if (month !== lastMonth) {
        labels.push({ month, weekIndex: idx });
        lastMonth = month;
      }
    });
    return labels;
  };

  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  const getIntensityClass = (count) => `heatmap-day intensity-${getIntensity(count)}`;

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
        {/* Month Labels using CSS Grid */}
        <div
          className="heatmap-months"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
            marginBottom: "4px",
          }}
        >
          {monthLabels.map((label) => (
            <div
              key={label.weekIndex}
              style={{ gridColumnStart: label.weekIndex + 1 }}
              className="heatmap-month-label"
            >
              {label.month}
            </div>
          ))}
        </div>

        <div className="heatmap-content-wrapper">
          <div
            className="heatmap-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
              gap: "var(--spacing-xs)",
            }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="heatmap-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={getIntensityClass(day.count)}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
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
