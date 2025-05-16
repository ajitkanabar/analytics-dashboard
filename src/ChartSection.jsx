import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const ChartSection = ({ selectedMonth, weeklyData, productData }) => {
  const barData = {
    labels: weeklyData.map((_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: `Sales in ${selectedMonth}`,
        data: weeklyData,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const pieData = {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        label: 'Product Share',
        data: productData || [0, 0, 0],
        backgroundColor: ['#3b82f6', '#facc15', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Sales Charts</h3>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '400px', height: '350px' }}>
          <Bar key={selectedMonth} data={barData} />
        </div>
        <div style={{ width: '350px', height: '350px' }}>
          <Pie key={selectedMonth} data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
