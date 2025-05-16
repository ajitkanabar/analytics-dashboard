import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GrossProfitChart = ({ data }) => {
  const chartData = data.map((entry) => {
    const totalCost = Object.values(entry.costs || {}).reduce((sum, val) => sum + val, 0);
    const profit = entry.total - totalCost;
    return {
      month: entry.month,
      profit,
    };
  });

  return (
    <div style={{ background: '#fff', marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h3>Gross Profit Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrossProfitChart;

