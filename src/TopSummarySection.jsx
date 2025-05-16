import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
  } from 'recharts';
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#8b5cf6'];
  
  const cardStyles = {
    pie: {
      background: 'linear-gradient(to bottom right, #e0f2fe, #ffffff)',
      boxShadow: '0 4px 12px rgba(3, 105, 161, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #bae6fd',
      flex: 1,
    },
    profit: {
      background: 'linear-gradient(to bottom right, #dcfce7, #ffffff)',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #bbf7d0',
      flex: 1,
    },
    margin: {
      background: 'linear-gradient(to bottom right, #fef3c7, #ffffff)',
      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #fde68a',
      flex: 1,
    }
  };
  
  const TopSummarySection = ({ data, current }) => {
    const totalCost = Object.values(current.costs || {}).reduce((sum, val) => sum + val, 0);
  
    const costPieData = Object.entries(current.costs || {}).map(([key, value]) => ({
      name: key,
      value,
    }));
  
    const profitTrend = data.map(entry => ({
      month: entry.month,
      profit: entry.total - Object.values(entry.costs || {}).reduce((sum, val) => sum + val, 0),
    }));
  
    const marginTrend = data.map(entry => {
      const cost = Object.values(entry.costs || {}).reduce((sum, val) => sum + val, 0);
      const margin = entry.total > 0 ? ((entry.total - cost) / entry.total) * 100 : 0;
      return {
        month: entry.month,
        margin: parseFloat(margin.toFixed(1)),
      };
    });
  
    return (
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {/* Pie Chart */}
        <div style={cardStyles.pie}>
          <h4 style={{ marginBottom: '10px' }}>Cost Breakdown – {current.month}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={costPieData} dataKey="value" nameKey="name" label outerRadius={90}>
                {costPieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        {/* Line Chart – Gross Profit */}
        <div style={cardStyles.profit}>
          <h4 style={{ marginBottom: '10px' }}>Gross Profit Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={profitTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
  
        {/* Bar Chart – Margin % */}
        <div style={cardStyles.margin}>
          <h4 style={{ marginBottom: '10px' }}>Margin % Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={marginTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="margin" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default TopSummarySection;
  