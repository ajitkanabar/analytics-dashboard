import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Group, Select, Text, Space } from '@mantine/core';
import SummaryChart from './SummaryChart';
import Comparison from './Comparison';
import MonthlyComparison from './MonthlyComparison';

const monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekOptions = ['W1', 'W2', 'W3', 'W4', 'W5'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Summary() {
  const [view, setView] = useState('summary');
  const [month, setMonth] = useState('Jun');
  const [week, setWeek] = useState('W1');
  const [data, setData] = useState([]);
  const [reqTypes, setReqTypes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/summary')
      .then((res) => res.json())
      .then((json) => {
        const enriched = json.map((d) => {
          const dateObj = new Date(d.Date);
          const weekNum = Math.ceil(dateObj.getDate() / 7);
          return {
            ...d,
            _month: monthOptions[dateObj.getMonth()],
            _week: `W${weekNum}`,
            _day: daysOfWeek[dateObj.getDay()],
          };
        });
        setData(enriched);
        const types = [...new Set(enriched.map((d) => d.ReqType))].sort();
        setReqTypes(types);
      })
      .catch((err) => console.error('❌ Failed to load summary data:', err));
  }, []);

  let filtered = data.filter((row) => row._month === month && row._week === week);
  filtered.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  const groupedByReqType = reqTypes.map((type) => {
    const chartData = daysOfWeek.map((day) => ({
      day,
      count: filtered.filter((r) => r.ReqType === type && r._day === day).length,
    }));
    const total = chartData.reduce((sum, c) => sum + c.count, 0);
    return { reqType: type, chartData, total };
  });

  const getDateRangeLabel = () => {
    if (filtered.length === 0) return null;
    const start = new Date(filtered[0].Date);
    const end = new Date(filtered[filtered.length - 1].Date);
    const format = (d) =>
      `${daysOfWeek[d.getDay()]} ${String(d.getDate()).padStart(2, '0')} ${monthOptions[d.getMonth()]}`;
    return `${format(start)} – ${format(end)}`;
  };

  const colors = ['#60a5fa', '#f97316', '#10b981', '#e879f9', '#facc15', '#38bdf8', '#f472b6'];

  return (
    <Box p="md">
      <Flex justify="space-between" align="center" mb="md">
        <Group wrap="nowrap">
          <Select label="Month" data={monthOptions} value={month} onChange={setMonth} w={130} />
          {view === 'summary' && (
            <Select label="Week" data={weekOptions} value={week} onChange={setWeek} w={100} />
          )}
        </Group>

        <Button.Group>
          <Button
            radius="md"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: view === 'summary' ? '#1e293b' : '#f1f5f9',
              color: view === 'summary' ? 'white' : '#1e293b',
              border: '1px solid #1e293b',
            }}
            onClick={() => setView('summary')}
          >
            Summary
          </Button>
          <Button
            radius="md"
            style={{
              borderRadius: 0,
              backgroundColor: view === 'weekly' ? '#1e293b' : '#f1f5f9',
              color: view === 'weekly' ? 'white' : '#1e293b',
              border: '1px solid #1e293b',
            }}
            onClick={() => setView('weekly')}
          >
            Weekly
          </Button>
          <Button
            radius="md"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              backgroundColor: view === 'monthly' ? '#1e293b' : '#f1f5f9',
              color: view === 'monthly' ? 'white' : '#1e293b',
              border: '1px solid #1e293b',
            }}
            onClick={() => setView('monthly')}
          >
            Monthly
          </Button>
        </Button.Group>
      </Flex>

      {view === 'summary' && (
        <>
          {filtered.length > 0 && (
            <Text size="sm" mb="sm" c="dimmed">
              Date range: <b>{getDateRangeLabel()}</b>
            </Text>
          )}
          <Flex wrap="wrap" gap="lg">
            {groupedByReqType.map(({ reqType, chartData, total }, idx) => (
              <div
                key={reqType}
                style={{
                  flex: '0 1 calc(50% - 1rem)',
                  maxWidth: 'calc(50% - 1rem)',
                  marginBottom: '1rem',
                }}
              >
                <SummaryChart 
                title={reqType} 
                data={chartData}
                fullData={filtered.filter((r) => r.ReqType === reqType)} // new prop for the table
                total={total}
                color={colors[idx % colors.length]}
                selectedMonth={month}
                selectedWeek={week}
                 />
              </div>
            ))}
          </Flex>
          <Space h="lg" />
        </>
      )}

      {view === 'weekly' && <Comparison month={month} week={week} />}
      {view === 'monthly' && <MonthlyComparison month={month} />}
    </Box>
  );
}
