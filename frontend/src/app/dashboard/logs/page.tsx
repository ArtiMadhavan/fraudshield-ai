"use client";
import { useState } from "react";
import { Search, Filter, History, ChevronRight } from "lucide-react";

export default function DecisionLogsPage() {
  const [logs] = useState([
    { id: "LOG-5592", txId: "TXN1234567890", timestamp: "2025-05-27 14:32:01", model: "v2.4.1", score: 85, decision: "Blocked", reason: "Velocity + IP Risk" },
    { id: "LOG-5591", txId: "TXN1234567889", timestamp: "2025-05-27 14:30:45", model: "v2.4.1", score: 12, decision: "Approved", reason: "Normal Pattern" },
    { id: "LOG-5590", txId: "TXN1234567888", timestamp: "2025-05-27 14:28:12", model: "v2.4.1", score: 62, decision: "Review", reason: "New Device" },
    { id: "LOG-5589", txId: "TXN1234567887", timestamp: "2025-05-27 14:25:00", model: "v2.4.0", score: 5, decision: "Approved", reason: "Trusted Customer" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Decision Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Audit trail of all AI Engine decisions.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by TXN ID or Log ID..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" /> Filters
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Timestamp</th>
              <th className="px-5 py-3 font-semibold">Log ID</th>
              <th className="px-5 py-3 font-semibold">Transaction</th>
              <th className="px-5 py-3 font-semibold">Model Ver</th>
              <th className="px-5 py-3 font-semibold">Risk Score</th>
              <th className="px-5 py-3 font-semibold">Decision</th>
              <th className="px-5 py-3 font-semibold">Primary Reason</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                <td className="px-5 py-4 font-bold text-slate-600">{log.id}</td>
                <td className="px-5 py-4 font-mono text-xs text-blue-600 hover:underline">{log.txId}</td>
                <td className="px-5 py-4 font-semibold text-slate-600">{log.model}</td>
                <td className="px-5 py-4 font-bold text-slate-900">{log.score}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.decision === 'Blocked' ? 'bg-red-50 text-red-600' : log.decision === 'Review' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {log.decision}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-medium text-slate-600 flex items-center justify-between">
                  {log.reason}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
