'use client';

import { useState, useEffect } from 'react';
import { FileSearch, Download, Filter, Calendar } from 'lucide-react';
import { AuditLogger, type AuditLogEntry } from '@/lib/audit';
import { useOpik } from '@/lib/opik';
import { format } from 'date-fns';

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [filters, setFilters] = useState<{
    action?: AuditLogEntry['action'];
    dataType?: AuditLogEntry['dataType'];
  }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const opik = useOpik();

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = async () => {
    const allLogs = await AuditLogger.getLogs();
    setLogs(allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    opik.logNonSensitive('audit_trail_viewed', {});
  };

  const applyFilters = async () => {
    if (!filters.action && !filters.dataType) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = await AuditLogger.getFilteredLogs(filters);
    setFilteredLogs(filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const exportLogs = async () => {
    const exportData = await AuditLogger.exportLogs();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloomflow-audit-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    opik.logSensitive('audit_trail_exported', {});
  };

  const getActionColor = (action: AuditLogEntry['action']) => {
    const colors = {
      store: 'bg-green-100 text-green-800',
      retrieve: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      share: 'bg-purple-100 text-purple-800',
      consent: 'bg-yellow-100 text-yellow-800',
    };
    return colors[action] || 'bg-neutral-100 text-neutral-800';
  };

  const getDataTypeColor = (dataType: AuditLogEntry['dataType']) => {
    return dataType === 'sensitive'
      ? 'bg-accent-100 text-accent-800'
      : 'bg-neutral-100 text-neutral-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileSearch className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Audit Trail</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportLogs}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Export Audit Logs"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={filters.action || ''}
          onChange={(e) =>
            setFilters({ ...filters, action: e.target.value as AuditLogEntry['action'] || undefined })
          }
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Actions</option>
          <option value="store">Store</option>
          <option value="retrieve">Retrieve</option>
          <option value="delete">Delete</option>
          <option value="share">Share</option>
          <option value="consent">Consent</option>
        </select>

        <select
          value={filters.dataType || ''}
          onChange={(e) =>
            setFilters({ ...filters, dataType: e.target.value as AuditLogEntry['dataType'] || undefined })
          }
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Data Types</option>
          <option value="sensitive">Sensitive</option>
          <option value="non-sensitive">Non-Sensitive</option>
        </select>

        {(filters.action || filters.dataType) && (
          <button
            onClick={() => setFilters({})}
            className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm hover:bg-neutral-300 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No audit logs found</p>
            {logs.length > 0 && (
              <p className="text-sm">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          (isExpanded ? filteredLogs : filteredLogs.slice(0, 10)).map(log => (
            <div
              key={log.id}
              className="p-3 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}
                    >
                      {log.action.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getDataTypeColor(log.dataType)}`}
                    >
                      {log.dataType}
                    </span>
                    <span className="text-sm font-medium text-neutral-700">{log.key}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    <span>{format(log.timestamp, 'MMM d, yyyy HH:mm:ss')}</span>
                  </div>
                  {log.details && isExpanded && (
                    <div className="mt-2 p-2 bg-neutral-50 rounded text-xs">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!isExpanded && filteredLogs.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Show all {filteredLogs.length} entries
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          All data access is logged for compliance and security purposes. This audit trail helps
          ensure transparency and accountability.
        </p>
      </div>
    </div>
  );
}
