import { useEffect, useState } from 'react';
import './App.css';
import ClientSpendChart from './clientspendchart';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [monthData, setMonthData] = useState(null);

  useEffect(() => {
    fetch('/salesdata.json')
      .then((res) => res.json())
      .then((data) => setSalesData(data.sales));
  }, []);

  useEffect(() => {
    const current = salesData.find((entry) => entry.month === selectedMonth);
    setMonthData(current);
  }, [selectedMonth, salesData]);

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="brand">brinersigns</h1>
        <ul>
          <li>Dashboard</li>
          <li>Sales</li>
          <li>Clients</li>
          <li>Reports</li>
        </ul>
      </aside>

      <main className="main-content">
        <h2 className="welcome">Welcome, Ajit</h2>

        <div className="month-selector">
          <label>Select Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {salesData.map((entry) => (
              <option key={entry.month} value={entry.month}>
                {entry.month}
              </option>
            ))}
          </select>
        </div>

        {monthData && (
          <div className="summary-cards">
            <div className="card card-sales">
              <h4>Total Sales</h4>
              <p>${monthData.total.toLocaleString()}</p>
            </div>
            <div className="card card-customers">
              <h4>Customers</h4>
              <p>{monthData.customers}</p>
            </div>
            <div className="card card-profit">
              <h4>Gross Profit</h4>
              <p>
                $
                {(
                  monthData.total -
                  Object.values(monthData.costs).reduce((a, b) => a + b, 0)
                ).toLocaleString()}
              </p>
            </div>
            <div className="card card-margin">
              <h4>Margin %</h4>
              <p>{monthData.marginPercent}%</p>
            </div>
          </div>
        )}

        <ClientSpendChart />
      </main>
    </div>
  );
}

export default App;
