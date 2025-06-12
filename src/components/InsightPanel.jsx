// components/InsightPanel.jsx
import React from 'react';
import { Paper, Title, List, ThemeIcon } from '@mantine/core';
import { IconBulb } from '@tabler/icons-react';

export default function InsightPanel({ title, items }) {
  return (
    <Paper
      shadow="md"
      radius="md"
      p="md"
      style={{
        background: 'linear-gradient(145deg, #f0f4ff, #e6ecff)',
        border: '1px solid #cbd5e1',
        boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
        height: '100%',
      }}
    >
      <Title order={4} style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>
        {title}
      </Title>

      <List
        spacing="xs"
        size="sm"
        icon={
          <ThemeIcon color="blue" size={18} radius="xl">
            <IconBulb size={14} />
          </ThemeIcon>
        }
      >
        {items.map((point, i) => (
          <List.Item key={i}>{point}</List.Item>
        ))}
      </List>
    </Paper>
  );
}
