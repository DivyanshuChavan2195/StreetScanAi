import React, { useMemo } from 'react';
import { Report, Status, DangerLevel, ChartDataItem } from '../types';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { CHART_STATUS_COLORS, CHART_DANGER_COLORS } from '../constants';

interface AnalyticsPageProps {
  reports: Report[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ reports }) => {
  
  const statusData: ChartDataItem[] = useMemo(() => {
    const counts = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<Status, number>);

    return Object.entries(counts)
        .map(([label, value]) => ({
            label: label as Status,
            value,
            color: CHART_STATUS_COLORS[label as Status],
        }))
        .sort((a,b) => b.value - a.value);
  }, [reports]);

  const dangerData: ChartDataItem[] = useMemo(() => {
    const counts = reports.reduce((acc, report) => {
      acc[report.dangerLevel] = (acc[report.dangerLevel] || 0) + 1;
      return acc;
    }, {} as Record<DangerLevel, number>);

    const order: DangerLevel[] = [DangerLevel.Critical, DangerLevel.High, DangerLevel.Medium, DangerLevel.Low];

    return order.map(level => ({
        label: level,
        value: counts[level] || 0,
        color: CHART_DANGER_COLORS[level],
    }));
  }, [reports]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Analytics & Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-6">
          <BarChart title="Reports by Status" data={statusData} />
        </div>
        <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-6">
          <PieChart title="Danger Level Distribution" data={dangerData} />
        </div>
      </div>
    </div>
  );
};
