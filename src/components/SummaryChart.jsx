import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Paper, Text, Box, Table, ScrollArea, Button, Group } from '@mantine/core';

export default function SummaryChart({
  title,
  data,
  fullData,
  total,
  color = '#4dabf7',
  selectedMonth,
  selectedWeek,
}) {
  const [showTable, setShowTable] = useState(false);
  const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

  const enrichedRows = useMemo(() => fullData, [fullData]);

  const filteredRows = useMemo(() => {
    return enrichedRows.filter(
      (row) => row._month === selectedMonth && row._week === selectedWeek
    );
  }, [enrichedRows, selectedMonth, selectedWeek]);

  const formatDate = (rawDate) => {
    if (!rawDate) return '-';
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate;
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
  };

  return (
    <Paper
      shadow="md"
      radius="md"
      p="xs"
      style={{ background: '#1e1e2f', minHeight: showTable ? 300 : 200, position: 'relative' }}
    >
      <Group justify="space-between" mb="xs">
        <Text size="sm" weight={600} style={{ color }}>
          {title}
        </Text>
        <Button
          size="xs"
          variant="light"
          color="gray"
          onClick={() => setShowTable((prev) => !prev)}
          style={{ fontSize: '0.75rem' }}
        >
          {showTable ? 'Hide' : 'More Details'}
        </Button>
      </Group>

      {!showTable && (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1e1e2f" stopOpacity={0.9} />
              </linearGradient>
            </defs>

            <XAxis dataKey="day" stroke={color} tick={{ fill: color, fontSize: 12 }} />
            <YAxis stroke={color} tick={{ fill: color, fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                border: `1px solid ${color}`,
                color: '#ffffff',
                fontSize: '0.75rem',
                padding: '8px',
              }}
              labelStyle={{ color, fontWeight: 'bold' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <Box
        style={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          color,
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          opacity: 0.8,
        }}
      >
        Total: {total}
      </Box>

      {showTable && (
        <ScrollArea h={180} style={{ marginTop: 8 }}>
          <Table
            striped
            highlightOnHover
            withColumnBorders
            verticalSpacing="xs"
            horizontalSpacing="md"
            style={{
              fontSize: '0.75rem',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderCollapse: 'collapse',
              minWidth: 800,
            }}
          >
            <thead style={{ backgroundColor: '#0f172a' }}>
              <tr>
                <th style={{ textAlign: 'left' }}>OrdDate</th>
                <th style={{ textAlign: 'left' }}>JobName</th>
                <th style={{ textAlign: 'left' }}>Driver</th>
                <th style={{ textAlign: 'left' }}>CompanyName</th>
                <th style={{ textAlign: 'left' }}>OnsiteDetails</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                  <td>{formatDate(row.OrdDate || row.Date)}</td>
                  <td>{row.JobName || '-'}</td>
                  <td>{row.Driver || '-'}</td>
                  <td>{row.CompanyName || '-'}</td>
                  <td>{row.OnsiteDetails || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </Paper>
  );
}
