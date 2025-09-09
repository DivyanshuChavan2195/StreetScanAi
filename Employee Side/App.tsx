
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { ReportTable } from './components/ReportTable';
import { MapView } from './components/MapView';
import { ReportDetailModal } from './components/ReportDetailModal';
import { MOCK_REPORTS, MOCK_WORKERS } from './services/mockData';
import { WORKERS } from './constants';
import { Report, Status, SortConfig, SavedView, Activity, DangerLevel, Notification } from './types';
import { AlertTriangleIcon, CheckCircleIcon, ClipboardListIcon, WrenchIcon, ChatBubbleBottomCenterTextIcon, SearchIcon, BookmarkIcon, TrashIcon, FileDownIcon, ViewColumnsIcon } from './components/icons/Icons';
import { AnalyticsPage } from './components/AnalyticsPage';
import { HeatmapPage } from './components/HeatmapPage';
import { TeamsPage } from './components/TeamsPage';
import { SettingsPage } from './components/SettingsPage';
import { AIAssistant } from './components/AIAssistant';
import { ActivityFeed } from './components/ActivityFeed';
import { KanbanBoard } from './components/KanbanBoard';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';

export type Page = 'dashboard' | 'analytics' | 'heatmap' | 'teams' | 'settings';
export type ActiveView = 'list' | 'map' | 'board';
export type Theme = 'light' | 'dark';

const ITEMS_PER_PAGE = 10;
const MAX_NOTIFICATIONS = 50;

// Used for combining activities from all reports into a single feed
interface FeedItem extends Activity {
  reportId: string;
  reportAddress: string;
}

const App: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dangerFilter, setDangerFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [workerFilter, setWorkerFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'dangerScore', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  // State for Saved Views
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string>('default');
  const [isSavingView, setIsSavingView] = useState(false);
  const [viewName, setViewName] = useState('');

  // State for bulk actions
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [theme, setTheme] = useState<Theme>(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    setReports(MOCK_REPORTS);
    const storedViews = localStorage.getItem('fixfirst-saved-views');
    if (storedViews) {
      setSavedViews(JSON.parse(storedViews));
    }
    const storedNotifications = localStorage.getItem('fixfirst-notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('fixfirst-saved-views', JSON.stringify(savedViews));
  }, [savedViews]);

  useEffect(() => {
    localStorage.setItem('fixfirst-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dangerFilter, sortConfig, searchQuery, workerFilter]);

  // Sync selected view dropdown when filters change
   useEffect(() => {
    const matchingView = savedViews.find(
      (v) =>
        v.filters.status === statusFilter &&
        v.filters.danger === dangerFilter &&
        (v.filters.searchQuery || '') === searchQuery &&
        (v.filters.worker || 'All') === workerFilter &&
        JSON.stringify(v.sort) === JSON.stringify(sortConfig)
    );
    setSelectedViewId(matchingView ? matchingView.id : 'default');
  }, [statusFilter, dangerFilter, sortConfig, savedViews, searchQuery, workerFilter]);
  
  const addNotification = useCallback((notificationDetails: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationDetails,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  // Centralized filtering and sorting logic
  const filteredAndSortedReports = useMemo(() => {
    let processedReports = [...reports];
    
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        processedReports = processedReports.filter(r => 
            r.id.toLowerCase().includes(lowercasedQuery) ||
            r.location.address.toLowerCase().includes(lowercasedQuery) ||
            r.description.toLowerCase().includes(lowercasedQuery)
        );
    }

    if (workerFilter !== 'All') {
        if (workerFilter === 'Unassigned') {
            processedReports = processedReports.filter(r => !r.worker);
        } else {
            processedReports = processedReports.filter(r => r.worker === workerFilter);
        }
    }

    if (statusFilter !== 'All') processedReports = processedReports.filter(r => r.status === statusFilter);
    if (dangerFilter !== 'All') processedReports = processedReports.filter(r => r.dangerLevel === dangerFilter);

    if (sortConfig !== null && activeView === 'list') {
      processedReports.sort((a, b) => {
          let aValue, bValue;
          if (sortConfig.key === 'location') {
              aValue = a.location.address;
              bValue = b.location.address;
          } else {
              aValue = a[sortConfig.key as keyof Report];
              bValue = b[sortConfig.key as keyof Report];
          }
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
    }
    return processedReports;
  }, [reports, statusFilter, dangerFilter, sortConfig, searchQuery, workerFilter, activeView]);

  // New paginated reports logic
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedReports, currentPage]);
  
  const totalPages = useMemo(() => Math.ceil(filteredAndSortedReports.length / ITEMS_PER_PAGE), [filteredAndSortedReports]);

  const areAllOnPageSelected = useMemo(() => {
      const pageReportIds = paginatedReports.map(r => r.id);
      return pageReportIds.length > 0 && pageReportIds.every(id => selectedReportIds.includes(id));
  }, [paginatedReports, selectedReportIds]);
  
  const activityFeedItems = useMemo((): FeedItem[] => {
    const allActivities: FeedItem[] = [];
    reports.forEach(report => {
        report.activityLog.forEach(activity => {
            allActivities.push({
                ...activity,
                reportId: report.id,
                reportAddress: report.location.address,
            });
        });
    });
    // Sort descending by timestamp and take the latest 20
    return allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);
  }, [reports]);

  const handleToggleReportSelection = useCallback((reportId: string) => {
    setSelectedReportIds(prev => prev.includes(reportId) ? prev.filter(id => id !== reportId) : [...prev, reportId]);
  }, []);

  const handleToggleAllOnPage = useCallback(() => {
      const pageReportIds = paginatedReports.map(r => r.id);
      if (areAllOnPageSelected) {
          setSelectedReportIds(prev => prev.filter(id => !pageReportIds.includes(id)));
      } else {
          setSelectedReportIds(prev => [...new Set([...prev, ...pageReportIds])]);
      }
  }, [paginatedReports, areAllOnPageSelected]);
  
  const handleClearSelection = useCallback(() => setSelectedReportIds([]), []);

  const handleBulkUpdate = useCallback((action: 'status' | 'worker', value: string) => {
      let changedCount = 0;
      reports.forEach(report => {
        if(selectedReportIds.includes(report.id)) {
            if (action === 'status' && report.status !== value) changedCount++;
            if (action === 'worker') {
                const newWorker = value === 'Unassigned' ? undefined : value;
                if(report.worker !== newWorker) changedCount++;
            }
        }
      });

      if (changedCount > 0) {
        const firstReport = reports.find(r => r.id === selectedReportIds[0]);
        if (firstReport) {
            addNotification({
                message: `Bulk updated ${changedCount} reports.`,
                reportId: firstReport.id,
                reportAddress: firstReport.location.address,
                type: 'bulk_update',
            });
        }
      }

      setReports(prevReports => {
          return prevReports.map(report => {
              if (selectedReportIds.includes(report.id)) {
                  let updatedReport = { ...report };
                  let activityMessage = '';
                  let activityType: Activity['type'] = 'status_change';
                  
                  if (action === 'status' && report.status !== value) {
                      updatedReport.status = value as Status;
                      activityMessage = `Status changed to "${value}".`;
                      activityType = 'status_change';
                  } else if (action === 'worker') {
                       const newWorker = value === 'Unassigned' ? undefined : value;
                       if (report.worker !== newWorker) {
                         updatedReport.worker = newWorker;
                         activityMessage = `Assigned to ${value}.`;
                         activityType = 'assignment';
                       }
                  }

                  if (activityMessage) {
                      const newActivity: Activity = { timestamp: new Date().toISOString(), message: activityMessage, type: activityType };
                      updatedReport.activityLog = [newActivity, ...report.activityLog];
                  }
                  return updatedReport;
              }
              return report;
          });
      });
      setSelectedReportIds([]);
  }, [selectedReportIds, reports, addNotification]);

  const handleSelectReport = (report: Report | null) => setSelectedReport(report);
  const handleCloseModal = () => setSelectedReport(null);
  
  const handleUpdateReport = (updatedReport: Report) => {
    const originalReport = reports.find(r => r.id === updatedReport.id);

    if (originalReport) {
        if (originalReport.status !== updatedReport.status) {
            let type: Notification['type'] = 'status_change';
            if (updatedReport.status === Status.Fixed) type = 'task_fixed';
            if (updatedReport.status === Status.Rejected) type = 'task_rejected';

            addNotification({
                message: `Status of "${originalReport.location.address.substring(0, 20)}..." updated to ${updatedReport.status}.`,
                reportId: originalReport.id,
                reportAddress: originalReport.location.address,
                type: type
            });
        }
        if (originalReport.worker !== updatedReport.worker) {
            addNotification({
                message: `Report at "${originalReport.location.address.substring(0, 20)}..." assigned to ${updatedReport.worker || 'Unassigned'}.`,
                reportId: originalReport.id,
                reportAddress: originalReport.location.address,
                type: 'assignment'
            });
        }
    }
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    setSelectedReport(updatedReport);
  };
  
  const handleUpdateReportStatus = useCallback((reportId: string, newStatus: Status) => {
    const report = reports.find(r => r.id === reportId);
    if(report && report.status !== newStatus) {
        let type: Notification['type'] = 'status_change';
        if (newStatus === Status.Fixed) type = 'task_fixed';
        if (newStatus === Status.Rejected) type = 'task_rejected';
        addNotification({
            message: `Status of "${report.location.address.substring(0, 20)}..." moved to ${newStatus}.`,
            reportId: report.id,
            reportAddress: report.location.address,
            type: type
        });
    }

    setReports(prevReports => {
        return prevReports.map(report => {
            if (report.id === reportId && report.status !== newStatus) {
                const updatedReport = { ...report, status: newStatus };
                const activityMessage = `Status changed from "${report.status}" to "${newStatus}".`;
                const newActivity: Activity = { timestamp: new Date().toISOString(), message: activityMessage, type: 'status_change' };
                updatedReport.activityLog = [newActivity, ...report.activityLog];
                return updatedReport;
            }
            return report;
        });
    });
  }, [reports, addNotification]);

  const handleSaveView = (name: string) => {
    if (!name.trim()) return;
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      filters: {
        status: statusFilter,
        danger: dangerFilter,
        searchQuery: searchQuery,
        worker: workerFilter,
      },
      sort: sortConfig
    };
    setSavedViews(prev => [...prev, newView]);
    setIsSavingView(false);
    setViewName('');
  };
  
  const handleApplyView = (viewId: string) => {
    setSelectedViewId(viewId);
    if (viewId === 'default') {
      setStatusFilter('All');
      setDangerFilter('All');
      setSearchQuery('');
      setWorkerFilter('All');
      setSortConfig({ key: 'dangerScore', direction: 'desc' });
    } else {
      const viewToApply = savedViews.find((v) => v.id === viewId);
      if (viewToApply) {
        setStatusFilter(viewToApply.filters.status);
        setDangerFilter(viewToApply.filters.danger);
        setSearchQuery(viewToApply.filters.searchQuery || '');
        setWorkerFilter(viewToApply.filters.worker || 'All');
        setSortConfig(viewToApply.sort);
      }
    }
  };
  
  const handleDeleteView = (viewId: string) => {
    if(window.confirm('Are you sure you want to delete this view?')) {
        setSavedViews(prev => prev.filter(v => v.id !== viewId));
        setSelectedViewId('default');
    }
  };

  const handleExportCsv = () => {
    if (reports.length === 0) {
      alert('No data to export.');
      return;
    }
    const headers = [ 'ID', 'Address', 'Latitude', 'Longitude', 'Timestamp', 'Reported By', 'Description', 'Upvotes', 'Danger Score', 'Danger Level', 'Road Type', 'Status', 'Assigned Worker' ];
    const escapeCsvCell = (cellData: any) => {
      const stringData = String(cellData ?? '');
      if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
        return `"${stringData.replace(/"/g, '""')}"`;
      }
      return stringData;
    };
    const csvRows = [ headers.join(','), ...reports.map((report) => [ report.id, report.location.address, report.location.lat, report.location.lng, report.timestamp, report.user.name, report.description, report.upvotes, report.dangerScore, report.dangerLevel, report.roadType, report.status, report.worker || 'N/A' ].map(escapeCsvCell).join(',')) ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `fixfirst_reports_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleSelectReportById = useCallback((reportId: string) => {
    const reportToSelect = reports.find(r => r.id === reportId);
    if(reportToSelect) {
        setSelectedReport(reportToSelect);
    } else {
        console.warn(`Report with ID ${reportId} not found.`);
    }
  }, [reports]);

  const handleMarkNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => n.read ? n : { ...n, read: true }));
  }, []);

  const summaryData = {
    total: reports.length,
    critical: reports.filter(r => r.dangerLevel === 'Critical').length,
    underReview: reports.filter(r => r.status === Status.UnderReview).length,
    fixed: reports.filter(r => r.status === Status.Fixed).length,
  };

  const renderContent = () => {
    switch (activePage) {
      case 'analytics': return <AnalyticsPage reports={reports} />;
      case 'heatmap': return <HeatmapPage reports={reports} />;
      case 'teams': return <TeamsPage workers={MOCK_WORKERS} reports={reports} />;
      case 'settings': return <SettingsPage theme={theme} setTheme={setTheme} />;
      case 'dashboard':
      default:
        return (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Reports" value={summaryData.total} icon={<ClipboardListIcon />} />
                <SummaryCard title="Critical Danger" value={summaryData.critical} icon={<AlertTriangleIcon />} color="text-red-500" />
                <SummaryCard title="Under Review" value={summaryData.underReview} icon={<WrenchIcon />} color="text-yellow-500" />
                <SummaryCard title="Recently Fixed" value={summaryData.fixed} icon={<CheckCircleIcon />} color="text-green-500" />
              </div>

              <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pothole Reports</h2>
                    <div className="flex items-center space-x-2 bg-gray-200 dark:bg-dark-bg p-1 rounded-lg">
                        <button onClick={() => setActiveView('list')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${activeView === 'list' ? 'bg-white dark:bg-dark-card shadow' : 'text-gray-600 dark:text-gray-400'}`}>List</button>
                        <button onClick={() => setActiveView('board')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${activeView === 'board' ? 'bg-white dark:bg-dark-card shadow' : 'text-gray-600 dark:text-gray-400'}`}><ViewColumnsIcon className="w-4 h-4 mr-1.5"/>Board</button>
                        <button onClick={() => setActiveView('map')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${activeView === 'map' ? 'bg-white dark:bg-dark-card shadow' : 'text-gray-600 dark:text-gray-400'}`}>Map</button>
                    </div>
                </div>

                <div className="w-full mb-4">
                  {selectedReportIds.length > 0 && activeView === 'list' ? (
                    <BulkActionsToolbar
                      selectedCount={selectedReportIds.length}
                      onBulkUpdate={handleBulkUpdate}
                      onClearSelection={handleClearSelection}
                      workers={WORKERS}
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <input
                            type="search"
                            placeholder="Search by ID, address, description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            aria-label="Search reports"
                          />
                        </div>
                        <div>
                          <label htmlFor="worker-filter" className="sr-only">Filter by worker</label>
                          <select
                            id="worker-filter"
                            value={workerFilter}
                            onChange={(e) => setWorkerFilter(e.target.value)}
                            className="w-full h-full px-3 rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="All">All Workers</option>
                            <option value="Unassigned">Unassigned</option>
                            {WORKERS.map((w) => (<option key={w} value={w}>{w}</option>))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 flex-wrap">
                              <label htmlFor="view-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved View:</label>
                              <div className="flex items-center">
                                  <select id="view-select" value={selectedViewId} onChange={(e) => handleApplyView(e.target.value)} className="rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                      <option value="default">Default View</option>
                                      {savedViews.map(view => ( <option key={view.id} value={view.id}>{view.name}</option> ))}
                                  </select>
                                  {selectedViewId !== 'default' && (
                                      <button onClick={() => handleDeleteView(selectedViewId)} className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" aria-label="Delete view">
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                  )}
                              </div>
                          </div>
                          {isSavingView ? (
                              <div className="flex items-center space-x-2">
                                  <input type="text" value={viewName} onChange={e => setViewName(e.target.value)} placeholder="Enter view name..." className="w-36 rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveView(viewName)} />
                                  <button onClick={() => handleSaveView(viewName)} className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Save</button>
                                  <button onClick={() => setIsSavingView(false)} className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border">Cancel</button>
                              </div>
                          ) : (
                            <button onClick={() => setIsSavingView(true)} className="flex items-center px-3 py-2 text-sm font-medium text-brand-primary bg-blue-100 border border-transparent rounded-md shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:bg-brand-primary/20 dark:text-blue-200 dark:hover:bg-brand-primary/30">
                                <BookmarkIcon className="w-4 h-4 mr-2" />
                                Save Current View
                            </button>
                          )}
                      </div>
                      <div className="flex items-center justify-between space-x-4 mt-4">
                        <div className="flex items-center space-x-4">
                            {activeView !== 'board' && (
                            <div>
                              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Status:</label>
                              <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option>All</option>
                                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            )}
                            <div>
                              <label htmlFor="danger-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Danger Level:</label>
                              <select id="danger-filter" value={dangerFilter} onChange={e => setDangerFilter(e.target.value)} className="rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option>All</option>
                                {Object.values(DangerLevel).map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                        </div>
                        <button onClick={handleExportCsv} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:bg-dark-card dark:text-gray-300 dark:border-dark-border dark:hover:bg-dark-bg">
                            <FileDownIcon className="w-4 h-4 mr-2" />
                            Export CSV
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {activeView === 'list' && (
                  <ReportTable 
                    reports={paginatedReports}
                    onSelectReport={handleSelectReport} 
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    selectedReportIds={selectedReportIds}
                    onToggleReportSelection={handleToggleReportSelection}
                    onToggleAllReportsSelection={handleToggleAllOnPage}
                    areAllVisibleReportsSelected={areAllOnPageSelected}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredAndSortedReports.length}
                  />
                )}
                {activeView === 'map' && (
                  <MapView reports={filteredAndSortedReports} onSelectReport={handleSelectReport} />
                )}
                 {activeView === 'board' && (
                  <KanbanBoard 
                    reports={filteredAndSortedReports} 
                    onSelectReport={handleSelectReport}
                    onUpdateReportStatus={handleUpdateReportStatus}
                  />
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed items={activityFeedItems} onSelectReportById={handleSelectReportById} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200">
      <Sidebar activePage={activePage} onNavClick={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onSelectReportById={handleSelectReportById}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg dark:bg-dark-bg p-6">
          {renderContent()}
        </main>
      </div>
      {selectedReport && <ReportDetailModal report={selectedReport} onClose={handleCloseModal} onUpdate={handleUpdateReport} />}
      <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} reports={reports} />
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-secondary transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
        aria-label="Open AI Assistant"
      >
        <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default App;
