import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Grid, Title, Paper, Text, Box } from '@mantine/core';

export default function ChartSection({ filtered, onClickBar }) {
  const ChartBox = ({ title, dataset, color }) => {
    const total = dataset.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const isCurrency = title.includes('Credit ($)');

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div
            style={{
              background: '#2c2c3e',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              fontSize: '14px',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div>
              {isCurrency
                ? `$${(payload[0].value || 0).toLocaleString()}`
                : payload[0].value}
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <Paper withBorder radius="md" p="md" style={{ background: '#1e1e2f', position: 'relative' }}>
        <Title order={5} c="white" mb="xs">
          {title}
        </Title>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={dataset}
            margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            onClick={(e) => {
              if (e && e.activeLabel) onClickBar(e.activeLabel);
            }}
          >
            <defs>
              <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c3e" />
            <XAxis
              dataKey="department"
              stroke="#ccc"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={70}
            />
            <YAxis
              stroke="#ccc"
              tickFormatter={(val) => isCurrency ? `${val / 1000}k` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill={`url(#fill-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>

        <Box mt="xs">
          <Text c="white" size="sm" fw={500}>
            Total: {isCurrency ? `$${total.toLocaleString()}` : total}
          </Text>
        </Box>
      </Paper>
    );
  };

  return (
    <Grid mt="md">
      <Grid.Col span={6}>
        <ChartBox
          title="Total Credit ($) by Department"
          dataset={filtered.amountData}
          color="#00d2ff"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <ChartBox
          title="Credit Count by Department"
          dataset={filtered.countData}
          color="#ff6a00"
        />
      </Grid.Col>
    </Grid>
  );
}
