import './App.css';
import { useEffect, useState } from 'react';
import ChartSection from './ChartSection';
import GrossProfitChart from './GrossProfitChart';
import TopSummarySection from './TopSummarySection';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setSalesData(data.sales));
  }, []);

  const current = salesData.find(entry => entry.month === selectedMonth) || {
    weekly: [],
    total: 0,
    customers: 0,
    costs: {},
    products: [],
    marginPercent: 45
  };

  const totalCost = Object.values(current.costs).reduce((sum, val) => sum + val, 0);
  const grossProfit = current.total - totalCost;
  const margin = current.total > 0 ? (grossProfit / current.total) * 100 : 0;

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '220px', background: '#f3f4f6', padding: '20px' }}>
        <h2 style={{ fontSize: '22px', color: '#1e3a8a', textTransform: 'lowercase', fontWeight: 'bold' }}>brinersigns</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Sales</a></li>
          <li><a href="#">Customers</a></li>
          <li><a href="#">Reports</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main" style={{ flex: 1, padding: '20px' }}>
        <h1>briner signs</h1>
        <p>This is your analytical dashboard.</p>

        {/* Month Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label>Select Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {salesData.map(entry => (
              <option key={entry.month} value={entry.month}>
                {entry.month}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards with Top Charts */}
        <TopSummarySection
          total={current.total}
          totalCost={totalCost}
          grossProfit={grossProfit}
          margin={margin}
        />

        {/* KPI Cards */}
        <div className="kpi-container" style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div className="kpi-card" style={cardStyle}><h3>Total Sales</h3><p>${current.total.toLocaleString()}</p></div>
          <div className="kpi-card" style={cardStyle}><h3>Customers</h3><p>{current.customers}</p></div>
          <div className="kpi-card" style={cardStyle}><h3>Total Cost</h3><p>${totalCost.toLocaleString()}</p></div>
          <div className="kpi-card" style={cardStyle}><h3>Gross Profit</h3><p>${grossProfit.toLocaleString()}</p></div>
          <div className="kpi-card" style={cardStyle}><h3>Margin %</h3><p>{margin.toFixed(1)}%</p></div>
        </div>

        {/* Cost Breakdown Table */}
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', marginTop: '20px', borderRadius: '4px' }}>
          <h3>Cost Breakdown – {selectedMonth}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={thStyle}>Cost Type</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(current.costs).map(([key, value]) => (
                <tr key={key}>
                  <td style={tdStyle}>{key}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>${value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <ChartSection
          selectedMonth={selectedMonth}
          weeklyData={current.weekly}
          productData={current.products}
        />
        <GrossProfitChart data={salesData} />
      </div>
    </div>
  );
}

// === Styles ===
const cardStyle = {
  background: '#fff',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  flex: '1 1 200px',
};

const thStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee',
  textTransform: 'capitalize',
};

export default App;
