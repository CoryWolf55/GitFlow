import { PieChart as RechartPieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "../styles/piechart.css";

// Colors matching the DevMetric design system
const COLORS = [
  "#3b82f6", // primary blue
  "#22d3ee", // accent cyan
  "#8b5cf6", // accent violet
  "#38bdf8", // accent sky
  "#22c55e", // success green
  "#f59e0b", // warning yellow
  "#f97316", // orange
  "#ec4899"  // pink
];

function PieChart({ data }) {
  const chartData = Object.entries(data).map(([name, size]) => ({
    name,
    value: size
  }));

  if (chartData.length === 0) {
    return <div className="piechart-empty">No language data found</div>;
  }

  return (
    <div className="piechart-container">
      <h3>Top Languages</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartPieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={40}
            fill="#8884d8"
            label={false}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            onClick={() => {}} // disable legend clicks
          />
        </RechartPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;
