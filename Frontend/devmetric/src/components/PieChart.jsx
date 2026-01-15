import { PieChart as RechartPieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "../styles/piechart.css";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28BFF", "#FF6699", "#FF6666", "#33CCFF"
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
            outerRadius={100}
            fill="#8884d8"
            label={(entry) => entry.name}
            isAnimationActive={false} // optional, stops animation on click
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
