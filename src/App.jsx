
import React, { useEffect, useState } from 'react';
import './App.css';
import data from '../public/data.json';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const cardThemes = ['#4f81bd', '#9bbb59', '#c0504d', '#8064a2', '#f79646'];
const pieColors = ['#4f81bd', '#c0504d', '#9bbb59'];

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    const selected = data.sales.find(item => item.month === selectedMonth);
    setMonthlyData(selected);
  }, [selectedMonth]);

  if (!monthlyData) return <div style={{ padding: 50 }}>Loading...</div>;

  const { total, customers, costs, products, weekly, marginPercent } = monthlyData;
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const grossProfit = total - totalCost;

  const weeklyData = weekly.map((value, i) => ({ week: 'W' + (i + 1), value }));
  const costData = Object.entries(costs).map(([key, val]) => ({ type: key, amount: val }));
  const pieData = products.map((val, i) => ({
    name: `Product ${String.fromCharCode(65 + i)}`,
    value: val
  }));

  const cardContent = [
    {
      title: 'Total Sales',
      value: `$${total.toLocaleString()}`,
      chart: (
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} />
        </LineChart>
      )
    },
    {
      title: 'Customers',
      value: customers,
      chart: (
        <BarChart data={[{ name: 'Customers', value: customers }]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#fff" />
        </BarChart>
      )
    },
    {
      title: 'Total Cost',
      value: `$${totalCost.toLocaleString()}`,
      chart: (
        <BarChart data={costData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#fff" />
        </BarChart>
      )
    },
    {
      title: 'Gross Profit',
      value: `$${grossProfit.toLocaleString()}`,
      chart: (
        <AreaChart data={[
          { name: 'Cost', value: totalCost },
          { name: 'Profit', value: grossProfit }
        ]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#fff" fillOpacity={0.6} fill="#fff" />
        </AreaChart>
      )
    },
    {
      title: 'Margin %',
      value: `${marginPercent}%`,
      chart: (
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={50}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )
    }
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI', background: '#f4f6fa', minHeight: '100vh' }}>
      <header style={{ background: '#0b2545', color: 'white', padding: '20px 30px', fontSize: '28px', fontWeight: 'bold' }}>
        brinersigns
      </header>

      <div style={{ padding: '30px' }}>
        <h2 style={{ fontSize: 14, margin: '10px 0 0 0' }}>Welcome, Ajit</h2>
        <p style={{ margin: '4px 0 20px 0' }}>This is your analytical dashboard.</p>

        <label>
          Select Month:{' '}
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: 6 }}>
            {data.sales.map(item => (
              <option key={item.month} value={item.month}>{item.month}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '25px', marginTop: '30px' }}>
          {cardContent.map((item, idx) => (
            <div key={idx} style={{
              background: cardThemes[idx % cardThemes.length],
              borderRadius: '10px',
              padding: '20px',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '240px'
            }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 'normal', fontSize: '16px' }}>{item.title}</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{item.value}</div>
              </div>
              <div style={{ height: '150px', marginTop: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {item.chart}
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
