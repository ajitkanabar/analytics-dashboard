import React, { useEffect, useState } from 'react';
import ChartSection from './ChartSection';
import {
  Group,
  Select,
  Title,
  Table,
  Flex,
  Paper,
} from '@mantine/core';

export default function CreditTab() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [filtered, setFiltered] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const DEPARTMENTS = [
    'Accounts', 'Management', 'Production', 'Client',
    'Installations', 'Customer Service', 'Sales', 'Creative', 'Logistics'
  ];

  const getMonthName = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-AU', { month: 'long' });
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/credits')
      .then(res => res.json())
      .then(json => {
        setData(json);

        const allMonths = Array.from(
          new Set(
            (json.rawData || [])
              .filter(r => parseFloat(r['Credit Amount']) > 0)
              .map(r => getMonthName(r['Request Received']))
          )
        ).sort((a, b) => new Date(`01 ${a} 2025`) - new Date(`01 ${b} 2025`));

        setMonths(['All', ...allMonths]);
      });
  }, []);

  useEffect(() => {
    if (!data.rawData) return;

    const result = data.rawData.filter(row => {
      const amount = parseFloat(row['Credit Amount']) || 0;
      const monthMatch =
        selectedMonth === 'All' ||
        getMonthName(row['Request Received']) === selectedMonth;
      return amount > 0 && monthMatch;
    });

    setFiltered(result);
  }, [selectedMonth, data]);

  const getChartData = () => {
    const grouped = {};
    const countMap = {};

    DEPARTMENTS.forEach(dept => {
      grouped[dept] = 0;
      countMap[dept] = 0;
    });

    filtered.forEach(row => {
      const dept = row.Department?.trim() || 'Unknown';
      const amt = parseFloat(row['Credit Amount']) || 0;
      if (grouped.hasOwnProperty(dept)) {
        grouped[dept] += amt;
        countMap[dept] += 1;
      }
    });

    return {
      amountData: DEPARTMENTS.map(dept => ({
        department: dept,
        value: grouped[dept] || 0
      })),
      countData: DEPARTMENTS.map(dept => ({
        department: dept,
        value: countMap[dept] || 0
      }))
    };
  };

  return (
    <>
      <Flex justify="space-between" align="end" mt="md" mb="sm">
        <Group spacing="md">
          <Select
            label="Month"
            data={months}
            value={selectedMonth}
            onChange={val => {
              setSelectedMonth(val);
              setTableRows([]);
            }}
            placeholder="Select month"
            style={{ minWidth: 140 }}
          />
        </Group>
      </Flex>

      <ChartSection
        filtered={getChartData()}
        onClickBar={dept => {
          const rows = filtered.filter(row => row.Department?.trim() === dept);
          setTableRows(rows);
        }}
      />

      {tableRows.length > 0 && (
        <>
          <Title order={4} mt="md">
            Credit Details – {tableRows[0].Department}
          </Title>
          <Paper shadow="xs" radius="md" p="md" mt="xs">
            <Table striped highlightOnHover withColumnBorders>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Job</th>
                  <th>Reason</th>
                  <th>Credit Amount</th>
                  <th>Request Received</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.Client}</td>
                    <td>{r.Job}</td>
                    <td>{r.Reason}</td>
                    <td>${Number(r['Credit Amount']).toLocaleString()}</td>
                    <td>{new Date(r['Request Received']).toLocaleDateString('en-AU')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </>
      )}
    </>
  );
}
