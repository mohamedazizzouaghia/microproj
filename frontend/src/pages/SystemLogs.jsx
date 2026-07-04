import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Download, Server, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../api';

const SystemLogs = () => {
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServiceStatus = async () => {
    const serviceList = [
      { name: 'api-gateway', port: 8080, url: '/api/events' },
      { name: 'auth-service', port: 8084, url: '/auth/login' },
      { name: 'user-service', port: 8081, url: '/api/users' },
      { name: 'event-service', port: 8082, url: '/api/events' },
      { name: 'reservation-service', port: 8083, url: '/api/reservations' },
      { name: 'club-service', port: 8085, url: '/api/clubs' },
      { name: 'incident-service', port: 8086, url: '/api/incidents' },
    ];

    const results = [];
    const logEntries = [];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    for (const svc of serviceList) {
      try {
        const startTime = performance.now();
        await api.get(svc.url, { timeout: 5000 });
        const latency = Math.round(performance.now() - startTime);
        results.push({ ...svc, status: 'UP', latency });
        logEntries.push(`[${now}] INFO  [${svc.name}] - Health check OK (${latency}ms)`);
      } catch (err) {
        if (err.response) {
          // Got a response (even 401/403 means service is up)
          const latency = Math.round(err.response.headers?.['x-response-time'] || 0);
          results.push({ ...svc, status: 'UP', latency });
          logEntries.push(`[${now}] INFO  [${svc.name}] - Service reachable (HTTP ${err.response.status})`);
        } else {
          results.push({ ...svc, status: 'DOWN', latency: 0 });
          logEntries.push(`[${now}] ERROR [${svc.name}] - Service unreachable: ${err.message}`);
        }
      }
    }

    setServices(results);
    setLogs(prev => [...logEntries, ...prev].slice(0, 100));
    setLoading(false);
  };

  useEffect(() => {
    fetchServiceStatus();
  }, []);

  const refreshLogs = () => {
    setLoading(true);
    fetchServiceStatus();
  };

  const exportLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `espritconnect-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const upCount = services.filter(s => s.status === 'UP').length;
  const downCount = services.filter(s => s.status === 'DOWN').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 text-green-400 rounded-lg">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">System Logs</h1>
            <p className="text-sm text-gray-500">{upCount} services up, {downCount} down</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={refreshLogs} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            Refresh
          </button>
          <button onClick={exportLogs} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg shadow-gray-800/30">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> Services
            </h3>
            <ul className="space-y-2 text-sm">
              {services.map((svc) => (
                <li
                  key={svc.name}
                  className={`flex justify-between items-center p-2 rounded-lg font-medium ${
                    svc.status === 'UP'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span className="truncate">{svc.name}</span>
                  <div className="flex items-center gap-2">
                    {svc.status === 'UP' && svc.latency > 0 && (
                      <span className="text-xs opacity-70">{svc.latency}ms</span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${svc.status === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                </li>
              ))}
              {services.length === 0 && (
                <li className="text-gray-400 text-center py-4">Loading...</li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3">
          <div className="bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-800 h-[600px] flex flex-col">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs font-mono text-gray-400">root@espritconnect:~</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-sm space-y-2">
              {logs.length === 0 && !loading && (
                <div className="text-gray-500 text-center py-8">No logs yet. Click Refresh to check service status.</div>
              )}
              {logs.map((log, i) => {
                let colorClass = 'text-gray-300';
                if (log.includes('ERROR')) colorClass = 'text-red-400 font-semibold';
                if (log.includes('WARN')) colorClass = 'text-yellow-400';
                if (log.includes('INFO')) colorClass = 'text-blue-300';

                return (
                  <div key={i} className={`${colorClass} whitespace-pre-wrap break-all`}>
                    {log}
                  </div>
                );
              })}
              <div className="text-gray-500 mt-4 animate-pulse">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
