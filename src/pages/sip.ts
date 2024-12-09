// mcp_frontend/src/pages/sip.ts

import { BackroadNodeManager } from '@backroad/backroad';
import { addSidebar } from '../components/sidebar';

export const sipPage = (br: BackroadNodeManager) => {
  addSidebar(br);

  const [col1, col2] = br.columns({ columnCount: 2 });
  const amount = col1.numberInput({
    label: 'Investment ($)',
    defaultValue: 100,
  });
  const rate = col1.numberInput({ label: 'Interest (%)', defaultValue: 10 });
  const years = col1.radio({
    label: 'Period',
    options: ['5 Years', '10 Years', '15 Years'],
  });
  const [finalAmount, chartData] = doMath(amount, rate, years);
  col1.write({ body: `## Final Amount: $${finalAmount.toFixed(2)}` });
  col2.pie({ data: chartData });
};

const doMath = (amount: number, rate: number, years: string) => {
  const periodMap: { [key: string]: number } = { '5 Years': 5, '10 Years': 10, '15 Years': 15 };
  const period = periodMap[years] || 0;
  const finalAmount = amount * Math.pow(1 + rate / 100, period);
  const chartData = {
    labels: ['Initial Amount', 'Interest'],
    datasets: [
      {
        data: [amount, finalAmount - amount],
        backgroundColor: ['#64bc9d', '#3b6f5d'],
        borderWidth: 0,
      },
    ],
  };
  return [finalAmount, chartData] as const;
};