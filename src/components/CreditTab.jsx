import React, { useEffect, useState } from 'react';
import { Table, Title, Card, Loader, Center, Text } from '@mantine/core';

const CreditsTab = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/credits')
      .then(res => res.json())
      .then(data => {
        setCredits(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch credits", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Center mt="xl"><Loader size="sm" /></Center>;
  }

  if (!credits.length) {
    return <Text>No credit data available.</Text>;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">Credits</Title>
      <Table striped highlightOnHover withTableBorder>
        <thead>
          <tr>
            {Object.keys(credits[0]).map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {credits.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default CreditsTab;
