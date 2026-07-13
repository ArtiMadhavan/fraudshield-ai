"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Download, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/investigations").then(res => {
      setHistory(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload History</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Audit logs of all manually tested transactions and batch uploads.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Analyst</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Decision</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No upload history found.</td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                       {new Date(log.time).toLocaleDateString()} {new Date(log.time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{log.transaction_id}</td>
                    <td className="px-6 py-4 font-medium">Aarav Singh (Admin)</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", log.risk_score >= 80 ? "bg-red-500" : log.risk_score >= 50 ? "bg-amber-500" : "bg-emerald-500")}></div>
                        <span className="font-semibold text-slate-900">{Math.round(log.risk_score)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                        log.risk_level === "Critical" ? "bg-red-100 text-red-700" :
                        log.risk_level === "High" ? "bg-amber-100 text-amber-700" :
                        "bg-emerald-100 text-emerald-700"
                      )}>
                        {log.risk_level === "Critical" ? "BLOCK" : log.risk_level === "High" ? "REVIEW" : "APPROVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">Logged</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
