
import React, { useEffect, useState } from 'react';
import './App.css';
import data from '../public/data.json';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    const monthData = data.sales.find(item => item.month === selectedMonth);
    setMonthlyData(monthData);
  }, [selectedMonth]);

  if (!monthlyData) return <div>Loading...</div>;

  const {
    total,
    customers,
    costs,
    products,
    weekly,
    marginPercent
  } = monthlyData;

  const grossProfit = total - Object.values(costs).reduce((a, b) => a + b, 0);

  const weeklySalesData = weekly.map((value, index) => ({
    week: `W${index + 1}`,
    sales: value
  }));

  const costBreakdown = Object.entries(costs).map(([key, value]) => ({
    type: key,
    amount: value
  }));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1 className="brand">brinersigns</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Overview</li>
            <li>Sales</li>
            <li>Customers</li>
            <li>Reports</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <h2>Welcome, Ajit</h2>
          <p>This is your analytical dashboard.</p>
          <label>
            Select Month:{' '}
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {data.sales.map((item, idx) => (
                <option key={idx} value={item.month}>{item.month}</option>
              ))}
            </select>
          </label>
        </header>

        <div className="cards-container">
          <div className="card theme1">
            <h3>Total Sales</h3>
            <p>${total.toLocaleString()}</p>
          </div>
          <div className="card theme2">
            <h3>Customers</h3>
            <p>{customers}</p>
          </div>
          <div className="card theme3">
            <h3>Total Cost</h3>
            <p>${Object.values(costs).reduce((a, b) => a + b, 0).toLocaleString()}</p>
          </div>
          <div className="card theme4">
            <h3>Gross Profit</h3>
            <p>${grossProfit.toLocaleString()}</p>
          </div>
          <div className="card theme5">
            <h3>Margin %</h3>
            <p>{marginPercent}%</p>
          </div>
        </div>

        <div className="charts-section">
          <h4>Weekly Sales Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <h4>Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default App;
