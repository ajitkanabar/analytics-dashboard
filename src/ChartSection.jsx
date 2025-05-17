import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function ChartSection({ data }) {
  const chartWrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  };

  const card = (title, value, chartElement, bgColor) => (
    <div style={{
      backgroundColor: bgColor,
      color: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    }}>
      <h4 style={{ marginBottom: '8px' }}>{title}</h4>
      <h2 style={{ marginTop: '0' }}>{value}</h2>
      <ResponsiveContainer width="100%" height={200}>
        {chartElement}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={chartWrapper}>
      {card("Total Sales", `$${data.total.toLocaleString()}`, (
        <LineChart data={data.weekly.map((val, i) => ({ name: 'W' + (i + 1), value: val }))}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} />
        </LineChart>
      ), '#508ed3')}

      {card("Customers", data.customers, (
        <BarChart data={[{ name: 'Customers', value: data.customers }]}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#ffffff" />
        </BarChart>
      ), '#70a542')}

      {card("Total Cost", `$${Object.values(data.costs).reduce((a, b) => a + b, 0).toLocaleString()}`, (
        <AreaChart data={Object.entries(data.costs).map(([key, value]) => ({ name: key, value }))}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area dataKey="value" stroke="#ffffff" fill="rgba(255,255,255,0.3)" />
        </AreaChart>
      ), '#a562d6')}

      {card("Product Split", "", (
        <PieChart>
          <Pie data={data.products.map((val, i) => ({ name: `Product ${i + 1}`, value: val }))} dataKey="value" label>
            {data.products.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      ), '#d36b7b')}
    </div>
  );
}

export default ChartSection;