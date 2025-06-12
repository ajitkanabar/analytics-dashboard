import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const chartTypes = {
  'Boards Installed': 'area',
  'Boards Removed': 'bar',
  'Onsites': 'line',
  'Lights Installed': 'area',
  'Lights Removed': 'bar',
};

const chartColors = {
  'Boards Installed': ['#00BFFF', '#FFA07A'],
  'Boards Removed': ['#00FFFF', '#FF4500'],
  'Onsites': ['#1E90FF', '#FF69B4'],
  'Lights Installed': ['#00FA9A', '#DA70D6'],
  'Lights Removed': ['#87CEEB', '#FF6347'],
};

const getTotal = (data, key) => data.reduce((sum, d) => sum + (d[key] || 0), 0);
const getChange = (v1, v2) =>
  `${v2 - v1 >= 0 ? '+' : ''}${v2 - v1} (${((v2 - v1) / (v1 || 1) * 100).toFixed(1)}%)`;

const MetricChart = ({ data, title }) => {
  const type = chartTypes[title] || 'line';
  const [color2024, color2025] = chartColors[title] || ['#ccc', '#999'];

  const total2024 = getTotal(data, 'y2024');
  const total2025 = getTotal(data, 'y2025');
  const changeText = getChange(total2024, total2025);

  const baseProps = {
    data,
    margin: { top: 20, right: 20, left: 0, bottom: -35 },
  };

  const formatTooltip = (value) => value.toLocaleString();

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
        borderRadius: '12px',
        padding: '1rem 1rem 0.5rem 1rem',
        boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
        color: 'white',
        minHeight: 380,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        {type === 'area' && (
          <AreaChart {...baseProps}>
            <defs>
              <linearGradient id="color2024" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2024} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color2024} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2025} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color2025} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#f1f5f9' }} />
            <YAxis tick={{ fill: '#f1f5f9' }} />
            <Tooltip
  formatter={formatTooltip}
  contentStyle={{
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid #475569',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  }}
  labelStyle={{ color: '#f8fafc', fontWeight: 500 }}
  itemStyle={{ color: '#e2e8f0' }}
/>

            <Legend />
            <Area type="monotone" dataKey="y2024" stroke={color2024} fill="url(#color2024)" name="2024" />
            <Area type="monotone" dataKey="y2025" stroke={color2025} fill="url(#color2025)" name="2025" />
          </AreaChart>
        )}
        {type === 'bar' && (
          <BarChart {...baseProps}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#f1f5f9' }} />
            <YAxis tick={{ fill: '#f1f5f9' }} />
            <Tooltip
  formatter={formatTooltip}
  contentStyle={{
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid #475569',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  }}
  labelStyle={{ color: '#f8fafc', fontWeight: 500 }}
  itemStyle={{ color: '#e2e8f0' }}
/>

            <Legend />
            <Bar dataKey="y2024" fill={color2024} name="2024" barSize={20} />
            <Bar dataKey="y2025" fill={color2025} name="2025" barSize={20} />
          </BarChart>
        )}
        {type === 'line' && (
          <LineChart {...baseProps}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#f1f5f9' }} />
            <YAxis hide />
            <Tooltip
  formatter={formatTooltip}
  contentStyle={{
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid #475569',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  }}
  labelStyle={{ color: '#f8fafc', fontWeight: 500 }}
  itemStyle={{ color: '#e2e8f0' }}
/>

            <Legend />
            <Line type="monotone" dataKey="y2024" stroke={color2024} strokeWidth={2} name="2024" />
            <Line type="monotone" dataKey="y2025" stroke={color2025} strokeWidth={2} name="2025" />
          </LineChart>
        )}
      </ResponsiveContainer>

      <div style={{ marginTop: 40, fontSize: '0.875rem' }}>
        <div>2024: <strong>{total2024}</strong></div>
        <div>2025: <strong>{total2025}</strong></div>
        <div style={{ color: total2025 - total2024 >= 0 ? 'limegreen' : 'salmon' }}>
          Change: <strong>{changeText}</strong>
        </div>
      </div>
    </div>
  );
};

export default MetricChart;
