import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const TopClients = ({ data }) => {
  // Calculate total spend per agency
  const topClientsData = data.map(client => {
    const total = Object.values(client.monthlySpend).reduce((sum, val) => sum + val, 0);
    return {
      agency: client.agency,
      total
    };
  });

  // Sort descending and take top 10
  const top10 = topClientsData.sort((a, b) => b.total - a.total).slice(0, 10);

  return (
    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '20px', marginTop: '30px' }}>
      <h3 style={{ color: 'white', marginBottom: '15px' }}>Top 10 Agencies by Annual Spend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top10} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis type="number" stroke="#cbd5e1" />
          <YAxis type="category" dataKey="agency" stroke="#cbd5e1" />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#4ade80" barSize={25} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopClients;
