
import React, { useState, useEffect } from 'react';
import ChartSection from './ChartSection';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json.sales);
        setSelectedMonth(json.sales[0].month);
        setSelectedData(json.sales[0]);
      });
  }, []);

  useEffect(() => {
    const monthData = data.find((m) => m.month === selectedMonth);
    setSelectedData(monthData);
  }, [selectedMonth, data]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">brinersigns</div>
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
      <main className="main">
        <header className="header">
          <div className="welcome">Welcome, Ajit</div>
          <div className="subtext">This is your analytical dashboard.</div>
          <label className="dropdown">
            Select Month:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {data.map((entry) => (
                <option key={entry.month} value={entry.month}>
                  {entry.month}
                </option>
              ))}
            </select>
          </label>
        </header>
        {selectedData && <ChartSection monthData={selectedData} />}
      </main>
    </div>
  );
};

export default App;
