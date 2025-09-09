import React from 'react';
import { ChartDataItem } from '../../types';

interface PieChartProps {
  title: string;
  data: ChartDataItem[];
}

const PieSlice: React.FC<{ item: ChartDataItem; percentage: number; offset: number; radius: number; }> = ({ item, percentage, offset, radius }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  const strokeDashoffset = -((offset / 100) * circumference);

  return (
    <circle
      cx="50%"
      cy="50%"
      r={radius}
      fill="transparent"
      stroke={item.color}
      strokeWidth="30"
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      transform="rotate(-90 100 100)"
      className="transition-all duration-1000 ease-out"
    >
      <title>{`${item.label}: ${item.value}`}</title>
    </circle>
  );
};

export const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeOffset = 0;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex-1 flex items-center justify-center space-x-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {total > 0 && data.map(item => {
              const percentage = (item.value / total) * 100;
              const slice = <PieSlice key={item.label} item={item} percentage={percentage} offset={cumulativeOffset} radius={85} />;
              cumulativeOffset += percentage;
              return slice;
            })}
          </svg>
        </div>
        <div className="flex flex-col space-y-2">
          {data.map(item => (
            <div key={item.label} className="flex items-center">
              <div
                className="w-4 h-4 rounded-sm mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};