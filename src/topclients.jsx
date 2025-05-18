import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const TopClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('/clients.json')
      .then((res) => res.json())
      .then((data) => {
        const withTotalSpend = data.clients.map(client => {
          const total = Object.values(client.monthlySpend).reduce((sum, val) => sum + val, 0);
          return {
            agency: client.agency,
            suburb: client.suburb,
            totalSpend: total
          };
        });
        const sorted = withTotalSpend.sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);
        setClients(sorted);
      });
  }, []);

  return (
    <div style={{ background: '#1e293b', color: 'white', padding: '20px', borderRadius: '10px', marginTop: '40px' }}>
      <h3 style={{ marginBottom: '20px' }}>Top 10 Clients by Annual Spend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={clients} layout="vertical" margin={{ left: 80, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" tick={{ fill: '#cbd5e1' }} />
          <YAxis dataKey="agency" type="category" tick={{ fill: '#cbd5e1' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" fill="#3b82f6" name="Annual Spend ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopClients;
