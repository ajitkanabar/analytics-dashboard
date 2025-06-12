import React, { useEffect, useState } from 'react';
import { Title, Flex, Space, Text } from '@mantine/core';
import MetricChart from './MetricChart';

const metrics = [
  'Boards Installed',
  'Boards Removed',
  'Lights Installed',
  'Lights Removed',
];

const yearFilter = ['2024', '2025'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MonthlyComparison = ({ month }) => {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/comparison')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(d => yearFilter.includes(String(d.Year)));
        setRawData(filtered);
      })
      .catch(err => {
        console.error('❌ Failed to load data', err);
      });
  }, []);

  const getFilteredData = (year) => {
    return rawData.filter(d =>
      String(d.Year) === String(year) && d.month === month
    );
  };

  return (
    <div style={{ padding: 0 }}>
      {!month ? (
        <Text size="sm" color="dimmed">
          Please select a month to view data.
        </Text>
      ) : (
        <>
          <Title
            order={4}
            style={{
              marginBottom: '1rem',
              color: 'rgb(1, 43, 109)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Monthly Comparison – {month} 2025
          </Title>

          <Flex wrap="wrap" gap="lg" justify="flex-start">
            {metrics.map((metric) => {
              const data2024 = getFilteredData('2024');
              const data2025 = getFilteredData('2025');

              const mergedData = days.map((day) => ({
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
        </>
      )}
    </div>
  );
};

export default MonthlyComparison;
