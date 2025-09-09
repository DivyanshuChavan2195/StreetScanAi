import React from 'react';
import { ChartDataItem } from '../../types';

interface BarChartProps {
  title: string;
  data: ChartDataItem[];
}

export const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex justify-around items-end h-64 space-x-2">
        {data.map(item => (
          <div key={item.label} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out"
              style={{
                height: `${(item.value / (maxValue || 1)) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${item.value}`}
            ></div>
            <div className="text-center mt-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{item.label}</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
