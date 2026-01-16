import "../styles/statssummary.css";
import StatsCard from "./StatsCard";

function StatsSummary({ stats }) {
  const statsData = [
    {
      icon: "fa-solid fa-code-commit",
      label: "Total Commits",
      value: stats?.totalCommits || 0,
      color: "#3b82f6"
    },
    {
      icon: "fa-solid fa-code-pull-request",
      label: "Pull Requests",
      value: stats?.totalPRs || 0,
      color: "#22c55e"
    },
    {
      icon: "fa-solid fa-star",
      label: "Stars Received",
      value: stats?.totalStars || 0,
      color: "#fbbf24"
    },
    {
      icon: "fa-solid fa-code-fork",
      label: "Forks",
      value: stats?.totalForks || 0,
      color: "#8b5cf6"
    },
    {
      icon: "fa-solid fa-folder",
      label: "Repositories",
      value: stats?.repoCount || 0,
      color: "#22d3ee"
    }
  ];

  return (
    <div className="stats-summary">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}

export default StatsSummary;
