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
      .then((data) => {
        console.log("📊 Loaded Months:", data.sales.map(m => m.month));
        setSalesData(data.sales);
      });
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
        <h2>📊 Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Sales</a></li>
          <li><a href="#">Customers</a></li>
          <li><a href="#">Reports</a></li>
        </ul>
      </div>

      {/* Main */}
      <div className="main" style={{ flex: 1, padding: '20px' }}>
        <h1>Welcome, Ajit</h1>
        <p>This is your analytical dashboard.</p>
        <TopSummarySection data={salesData} current={{ ...current, month: selectedMonth }} />


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

        {/* KPI + Chart side by side */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', alignItems: 'flex-start' }}>
          {/* KPI Cards - smaller with 3D style */}
          <div className="kpi-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '240px' }}>
            {[
              { label: "Total Sales", value: `$${current.total.toLocaleString()}` },
              { label: "Customers", value: current.customers },
              { label: "Total Cost", value: `$${totalCost.toLocaleString()}` },
              { label: "Gross Profit", value: `$${grossProfit.toLocaleString()}` },
              { label: "Margin %", value: `${margin.toFixed(1)}%` },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  boxShadow: '2px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              >
                <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#374151' }}>{item.label}</h4>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div style={{ flex: 1 }}>
            <ChartSection
              selectedMonth={selectedMonth}
              weeklyData={current.weekly}
              productData={current.products}
            />
          </div>
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

        {/* Gross Profit Line Chart */}
        <GrossProfitChart data={salesData} />
      </div>
    </div>
  );
}

// === Styles ===
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
