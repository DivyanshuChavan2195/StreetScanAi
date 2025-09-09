import { DangerLevel, Status } from './types';

export const DANGER_LEVEL_COLORS: Record<DangerLevel, string> = {
  [DangerLevel.Low]: 'bg-green-500 text-green-50 border-green-600',
  [DangerLevel.Medium]: 'bg-yellow-500 text-yellow-50 border-yellow-600',
  [DangerLevel.High]: 'bg-orange-500 text-orange-50 border-orange-600',
  [DangerLevel.Critical]: 'bg-red-700 text-red-50 border-red-800',
};

export const STATUS_COLORS: Record<Status, string> = {
  [Status.Reported]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [Status.UnderReview]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [Status.Assigned]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  [Status.Fixed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [Status.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const STATUS_OPTIONS: Status[] = [
  Status.Reported,
  Status.UnderReview,
  Status.Assigned,
  Status.Fixed,
  Status.Rejected,
];

export const WORKERS: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];

export const CHART_DANGER_COLORS: Record<DangerLevel, string> = {
  [DangerLevel.Low]: '#22c55e',       // green-500
  [DangerLevel.Medium]: '#f59e0b',    // yellow-500
  [DangerLevel.High]: '#f97316',      // orange-500
  [DangerLevel.Critical]: '#dc2626', // red-600
};

export const CHART_STATUS_COLORS: Record<Status, string> = {
    [Status.Reported]: '#3b82f6', // blue-500
    [Status.UnderReview]: '#eab308', // yellow-500
    [Status.Assigned]: '#6366f1', // indigo-500
    [Status.Fixed]: '#16a34a', // green-600
    [Status.Rejected]: '#ef4444' // red-500
};
