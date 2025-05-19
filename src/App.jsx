import { useEffect, useState } from 'react';
import './App.css';
import ClientSpendChart from './clientspendchart';
import TopClients from './topclients';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [monthData, setMonthData] = useState(null);

  useEffect(() => {
    fetch('/salesdata.json')
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data.sales);
        const initialMonth = data.sales.find(entry => entry.month === 'January');
        setMonthData(initialMonth);
      });
  }, []);

  useEffect(() => {
    fetch('/client.json')
      .then((res) => res.json())
      .then((data) => setClientData(data.clients));
  }, []);

  useEffect(() => {
    const entry = salesData.find(entry => entry.month === selectedMonth);
    setMonthData(entry);
  }, [selectedMonth, salesData]);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>BRINERSIGNS</h2>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Sales</a></li>
          <li><a href="#">Customers</a></li>
          <li><a href="#">Reports</a></li>
        </ul>
      </aside>

      <main className="main">
        <h1>Welcome, Ajit</h1>
        <p>This is your analytical dashboard.</p>
        <label>
          Select Month:
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {salesData.map(entry => (
              <option key={entry.month} value={entry.month}>
                {entry.month}
              </option>
            ))}
          </select>
        </label>

        {monthData && (
          <div className="summary-card">
            <p><strong>Total Sales</strong></p>
            <p>${monthData.total.toLocaleString()}</p>
            <p><strong>Customers</strong></p>
            <p>{monthData.customers}</p>
            <p><strong>Gross Profit</strong></p>
            <p>${Math.round(monthData.total * (monthData.marginPercent / 100)).toLocaleString()}</p>
            <p><strong>Margin %</strong></p>
            <p>{monthData.marginPercent}%</p>
          </div>
        )}

        <ClientSpendChart data={clientData} selectedMonth={selectedMonth} />
        <TopClients data={clientData} />
      </main>
    </div>
  );
}

export default App;
