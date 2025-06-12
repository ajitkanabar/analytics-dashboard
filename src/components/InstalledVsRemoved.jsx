// ⬇️ [unchanged imports + constants]
import React, { useEffect, useState } from 'react';
import { Box, Flex, Select, Title, Text, Paper, Group } from '@mantine/core';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ─────────────────────────── Chart Component ─────────────────────────── */
const AreaFilledChart = ({ title, data }) => (
  <Box
    style={{
      background: '#0f172a',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}
  >
    <Title order={4} style={{ color: 'white', marginBottom: '0.75rem' }}>{title}</Title>
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillInstall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillRemove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" stroke="#cbd5e1" />
        <YAxis stroke="#cbd5e1" />
        <Tooltip
          contentStyle={{ background: '#1e293b', borderRadius: 8, border: 'none' }}
          labelStyle={{ color: 'white' }}
          itemStyle={{ color: 'white' }}
        />
        <Area type="monotone" dataKey="y2024" stroke="#38bdf8" fill="url(#fillInstall)" name="Installed" />
        <Area type="monotone" dataKey="y2025" stroke="#f87171" fill="url(#fillRemove)" name="Removed" />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
);

/* ─────────────────────────── Insight Panel ─────────────────────────── */
const InsightPanel = ({ insights }) => (
  <Flex direction="column" gap={8} mt="xs">
    {insights.map((i, idx) => (
      <Paper key={idx} shadow="sm" radius="md" p="xs" withBorder style={{ minWidth: 240 }}>
        <Text size="sm" fw={500} style={{ color: i.color || '#1e293b' }}>
          {i.text}
        </Text>
      </Paper>
    ))}
  </Flex>
);

/* ────────────────────── Stats Line (below chart) ────────────────────── */
const StatLine = ({ installed, removed }) => {
  const variance = installed && removed ? Math.round(((installed - removed) / removed) * 100) : 0;
  return (
    <Group spacing="md" mt={6}>
      <Text size="sm" c="#38bdf8">Installed: {installed}</Text>
      <Text size="sm" c="#f87171">Removed: {removed}</Text>
      <Text size="sm">
        Variance:{' '}
        <span style={{ color: variance > 0 ? '#22c55e' : variance < 0 ? '#ef4444' : 'gray' }}>
          {variance}%
        </span>
      </Text>
    </Group>
  );
};

/* ─────────────────────────── Forecast Logic ─────────────────────────── */
const getForecastStats = (rows, month, metric) => {
  const today = new Date();
  const cutoff = today.getDate();
  const thisYearRows = rows.filter(r => r.Year === 2025 && r.month === month);
  const lastYearRows = rows.filter(r => r.Year === 2024 && r.month === month);

  const ytdThis = thisYearRows.filter(r => new Date(r.InstDate).getDate() <= cutoff)
    .reduce((sum, r) => sum + (r[metric] || 0), 0);
  const ytdLast = lastYearRows.filter(r => new Date(r.InstDate).getDate() <= cutoff)
    .reduce((sum, r) => sum + (r[metric] || 0), 0);
  const fullLast = lastYearRows.reduce((sum, r) => sum + (r[metric] || 0), 0);

  if (fullLast === 0) return null;

  const yoy = ytdLast > 0 ? (ytdThis - ytdLast) / ytdLast : 0;
  const forecast = Math.round(fullLast * (1 + yoy));

  return {
    yoy: Math.round(yoy * 100),
    forecast,
  };
};

/* ─────────────────────────── Installed vs Removed ─────────────────────────── */
export default function InstalledVsRemoved() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/comparison')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('API error', err));
  }, []);

  const buildRows = (installedKey, removedKey) =>
    days.map(day => {
      const filtered = data.filter(r => r.month === month && r.day === day);
      return {
        day,
        y2024: filtered.reduce((sum, r) => sum + (r[installedKey] || 0), 0),
        y2025: filtered.reduce((sum, r) => sum + (r[removedKey] || 0), 0),
      };
    });

  const getStats = (metric) =>
    data.filter(r => r.Year === 2025 && r.month === month)
        .reduce((sum, r) => sum + (r[metric] || 0), 0);

  const getLatestDate = () => {
    const filtered = data.filter(r => r.Year === 2025 && r.month === month);
    if (!filtered.length) return null;
    const dates = filtered.map(r => new Date(r.InstDate));
    const maxDate = new Date(Math.max(...dates));
    return maxDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const installedBoards = getStats('Boards Installed');
  const removedBoards = getStats('Boards Removed');
  const forecastBoards = getForecastStats(data, month, 'Boards Installed');

  const installedLights = getStats('Lights Installed');
  const removedLights = getStats('Lights Removed');
  const forecastLights = getForecastStats(data, month, 'Lights Installed');

  const renderInsights = (metric, installed, removed, forecast) => {
    const rows = data.filter(r => r.Year === 2025 && r.month === month);
    if (!rows.length) return [];

    const sorted = [...rows].sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
    const peak = sorted[0];
    const lowest = sorted[sorted.length - 1];

    const net = installed - removed;
    const forecastColor = forecast?.yoy > 0 ? '#22c55e' : forecast?.yoy < 0 ? '#ef4444' : 'gray';

    return [
      { text: `Peak ${metric.includes('Install') ? 'install' : 'remove'}: ${peak.day} ${peak.InstDate?.split('T')[0]} (${peak[metric]})` },
      { text: `Lowest ${metric.includes('Install') ? 'install' : 'remove'}: ${lowest.day} ${lowest.InstDate?.split('T')[0]} (${lowest[metric]})` },
      { text: `Balance: Net shift of ${net} installs` },
      forecast && {
        text: `Forecast: ${forecast.forecast} installs expected`,
        color: forecastColor,
      },
    ].filter(Boolean);
  };

  return (
    <Box p="md">
      {/* ─────────────────────── Filter and Note ─────────────────────── */}
      <Flex justify="space-between" align="center" mb="xs">
        <Select
          label="Month"
          data={months}
          value={month}
          onChange={setMonth}
          placeholder="Select month"
          w={180}
        />
        {month && (
          <Text size="sm" color="dimmed" mt={22} ml="sm">
            Data includes activity up to <strong>{getLatestDate()}</strong>
          </Text>
        )}
      </Flex>

      {!month ? (
        <Text size="sm" color="dimmed">Please select a month to view install/remove trends.</Text>
      ) : (
        <>
          {/* ────────────── Boards Section ────────────── */}
          <Title order={4} mb="sm" style={{ color: '#012b6d' }}>
            Boards Installed vs Removed — {month} 2025
          </Title>

          <Flex gap="lg" mb="lg" align="flex-start">
            <Box style={{ flex: 1.5 }}>
              <AreaFilledChart
                title="Boards Activity"
                data={buildRows('Boards Installed', 'Boards Removed')}
              />
              <StatLine installed={installedBoards} removed={removedBoards} />
            </Box>

            <InsightPanel
              insights={renderInsights('Boards Installed', installedBoards, removedBoards, forecastBoards)}
            />
          </Flex>

          {/* ────────────── Lights Section ────────────── */}
          <Title order={4} mb="sm" style={{ color: '#012b6d' }}>
            Lights Installed vs Removed — {month} 2025
          </Title>

          <Flex gap="lg" align="flex-start">
            <Box style={{ flex: 1.5 }}>
              <AreaFilledChart
                title="Lights Activity"
                data={buildRows('Lights Installed', 'Lights Removed')}
              />
              <StatLine installed={installedLights} removed={removedLights} />
            </Box>

            <InsightPanel
              insights={renderInsights('Lights Installed', installedLights, removedLights, forecastLights)}
            />
          </Flex>

          {/* ────────────── Forecast Disclaimer ────────────── */}
          <Paper
            mt="xl"
            p="md"
            radius="md"
            style={{
              background: '#f0f4f8',
              border: '1px solid #d1d5db',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Text size="xs" color="dimmed">
              <strong>Forecast Logic:</strong> The estimate is based on year-over-year pacing.
              For example, if installs are up 12% compared to this time last year, then we apply
              a 12% uplift to the full month total from last year to project this month’s outcome.
              It assumes similar seasonal workload patterns, barring unexpected segmented market events and trends.
            </Text>
          </Paper>
        </>
      )}
    </Box>
  );
}
