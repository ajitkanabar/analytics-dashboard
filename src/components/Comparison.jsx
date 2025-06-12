import React, { useEffect, useState } from 'react';
import MetricChart from './MetricChart';
import { Title, Flex, Space, Text } from '@mantine/core';

const metrics = [
  'Boards Installed',
  'Boards Removed',
  'Lights Installed',
  'Lights Removed'
];

const yearFilter = ['2024', '2025'];

function getStartEndDates(year, monthName, weekStr) {
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const month = monthMap[monthName];
  const week = parseInt(weekStr?.replace('W', ''), 10);

  const firstDay = new Date(year, month, 1);
  const firstMondayOffset = (8 - firstDay.getDay()) % 7;
  const firstMonday = new Date(year, month, 1 + firstMondayOffset);

  const startDate = new Date(firstMonday);
  startDate.setDate(startDate.getDate() + (week - 1) * 7);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const format = (d) =>
    d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return {
    start: format(startDate),
    end: format(endDate),
  };
}

const Comparison = ({ month, week }) => {
  const [rawData, setRawData] = useState([]);

  const getFilteredData = (year) => {
    return rawData.filter(d =>
      String(d.Year) === String(year) &&
      d.month === month &&
      d.week === week
    );
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/comparison')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(d => yearFilter.includes(String(d.Year)));
        setRawData(filtered);
      })
      .catch(err => {
        console.error('❌ Failed to load comparison data', err);
      });
  }, []);

  const dateRange = month && week ? getStartEndDates(2025, month, week) : null;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ padding: 0 }}>
      <Title
        order={4}
        style={{
          marginBottom: '1rem',
          color: 'rgb(1, 43, 109)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        2024 vs 2025 Comparison
      </Title>

      {dateRange && (
        <Text size="sm" color="dimmed" mb="lg">
          Showing data from <strong>{dateRange.start}</strong> to <strong>{dateRange.end}</strong>
        </Text>
      )}

      <Flex wrap="wrap" gap="lg" justify="flex-start">
        {metrics.map((metric) => {
          const data2024 = getFilteredData('2024');
          const data2025 = getFilteredData('2025');

          const mergedData = days.map(day => ({
            day,
            y2024: data2024
              .filter(d => d.day === day)
              .reduce((sum, r) => sum + (r[metric] || 0), 0),
            y2025: data2025
              .filter(d => d.day === day)
              .reduce((sum, r) => sum + (r[metric] || 0), 0),
          }));

          return (
            <div
              key={metric}
              style={{
                flex: '0 1 calc(50% - 1rem)',
                maxWidth: 'calc(50% - 1rem)',
                marginBottom: '1rem',
              }}
            >
              <MetricChart title={metric} data={mergedData} />
            </div>
          );
        })}
      </Flex>

      <Space h="lg" />
    </div>
  );
};

export default Comparison;
