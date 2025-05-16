import React, { useEffect, useState } from 'react';
import './App.css';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
  XAxis, YAxis, Legend
} from 'recharts';

function App() {
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('January');

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => setData(json.sales))
      .catch(console.error);
  }, []);

  const selected = data?.find(entry => entry.month === selectedMonth);
  const totalCost = selected ? Object.values(selected.costs).reduce((a, b) => a + b, 0) : 0;
  const grossProfit = selected ? selected.total - totalCost : 0;
  const marginPct = selected ? (grossProfit / selected.total) * 100 : 0;

  const pieData = selected?.products.map((value, i) => ({
    name: `Product ${String.fromCharCode(65 + i)}`,
    value
  }));

  const barData = Object.entries(selected?.costs || {}).map(([type, amt]) => ({ type, amt }));

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9fb', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#0B2C4D', padding: '15px 30px', color: 'white', fontSize: '20px' }}>
        brinersigns
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '200px', backgroundColor: '#102841', color: 'white',
          padding: '20px', height: '100vh'
        }}>
          <h3>📊 Dashboard</h3>
          <nav>
            <p>Overview</p>
            <p>Sales</p>
            <p>Customers</p>
            <p>Reports</p>
          </nav>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '30px' }}>
          <h1 style={{ marginBottom: 5 }}>Welcome, Ajit</h1>
          <p>This is your analytical dashboard.</p>

          <div style={{ margin: '20px 0' }}>
            <label><strong>Select Month:</strong></label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              {data?.map(d => (
                <option key={d.month}>{d.month}</option>
              ))}
            </select>
          </div>

          {/* Top Metric Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px', marginBottom: '30px'
          }}>
            <div className="card"><strong>Total Sales</strong><div>${selected?.total?.toLocaleString()}</div></div>
            <div className="card"><strong>Customers</strong><div>{selected?.customers}</div></div>
            <div className="card"><strong>Total Cost</strong><div>${totalCost?.toLocaleString()}</div></div>
            <div className="card"><strong>Gross Profit</strong><div>${grossProfit?.toLocaleString()}</div></div>
            <div className="card"><strong>Margin %</strong><div>{marginPct.toFixed(1)}%</div></div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {/* Line Chart: Weekly Sales */}
            <div className="chart-card">
              <h4>Weekly Sales Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selected?.weekly.map((val, idx) => ({ week: `W${idx + 1}`, val }))}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="val" stroke="#3E9BFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart: Cost Breakdown */}
            <div className="chart-card">
              <h4>Cost Breakdown</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amt" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart: Gross Profit Trend */}
            <div className="chart-card">
              <h4>Profit vs Cost</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { name: 'Sales', value: selected?.total },
                  { name: 'Cost', value: totalCost },
                  { name: 'Profit', value: grossProfit }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Product Mix */}
            <div className="chart-card">
              <h4>Product Mix</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                    {pieData?.map((_, index) => (
                      <Cell key={index} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
