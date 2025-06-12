import React from 'react';
import { Box } from '@mantine/core';
import {
  IconTruck,
  IconLayoutDashboard,
  IconChartBar,
  IconCreditCard,
  IconUsersGroup,
  IconClipboardList,
  IconClock,
  IconUserCheck,
  IconDatabase,
  IconPresentationAnalytics,
  IconFileAnalytics,
} from '@tabler/icons-react';

const iconItems = [
  { label: 'Summary', icon: IconLayoutDashboard },
  { label: 'Install vs Remove', icon: IconFileAnalytics},
  { label: 'Credits', icon: IconCreditCard },
  { label: 'Onsites', icon: IconTruck },
  { label: 'Driver KPI', icon: IconUsersGroup },
  { label: 'Driver Summary', icon: IconClipboardList },
  { label: 'Overtime', icon: IconClock },
  { label: 'Absentee', icon: IconUserCheck },
  { label: 'Production', icon: IconDatabase },
  { label: 'Time on Site', icon: IconPresentationAnalytics },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <Box
      w={240}
      h="100%"
      px="md"
      py="lg"
      style={{
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#f9fafb',
      }}
    >
      <h2 style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '1rem', color: '#1e3a8a' }}>
        Welcome, Ajit
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
        {iconItems.map(({ label, icon: Icon }, idx) => (
          <div
            key={idx}
            onClick={() => onTabChange(label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: activeTab === label ? '#1e3a8a' : '#1a1a1a',
              fontWeight: activeTab === label ? 600 : 400,
              cursor: 'pointer',
              backgroundColor: activeTab === label ? '#e8f0ff' : 'transparent',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Icon size={26} color={activeTab === label ? '#1e3a8a' : '#1a1a1a'} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Box>
  );
}
