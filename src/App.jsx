import { useState } from 'react';
import { Box, Flex } from '@mantine/core';
import AppHeader from './components/AppHeader';
import Sidebar from './components/Sidebar';
import Summary from './components/Summary';
import Comparison from './components/Comparison';
import CreditsTab from './components/CreditTab';
import MonthlyComparison from './components/MonthlyComparison';
import InstalledVsRemoved from './components/InstalledVsRemoved';


export default function App() {
  const [activeTab, setActiveTab] = useState('Summary');
  const [selectedYear, setSelectedYear] = useState(); // Match your data
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  return (
    <Flex direction="column" h="100vh">
      <AppHeader />

      <Flex style={{ flex: 1 }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <Box p="md" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'Comparison' && (
            <Comparison
              selectedYear={selectedYear}
              month={selectedMonth}
              week={selectedWeek}
            />
          )}

          {activeTab === 'Summary' && <Summary />}
          {activeTab === 'Credits' && <CreditsTab />}
          {activeTab === 'Install vs Remove' && <InstalledVsRemoved />}   

          {['Onsites', 'Driver KPI'].includes(activeTab) && (
            <p>Chart for {activeTab} coming soon...</p>
          )}
          {['Driver Summary', 'Production'].includes(activeTab) && (
            <p style={{ color: 'orange' }}>Placeholder: charts pending</p>
          )}
          {['Absentee', 'Time on Site'].includes(activeTab) && (
            <p style={{ color: 'red' }}>No data available yet</p>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
