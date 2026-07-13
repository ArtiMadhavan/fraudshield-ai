"use client";
import { useState } from "react";
import { Search, Filter, ShieldAlert, Plus, AlertCircle } from "lucide-react";

export default function WatchlistPage() {
  const [entities] = useState([
    { id: "IP-192.168.1.55", type: "IP Address", reason: "Multiple Chargebacks", addedOn: "2025-05-25", riskLevel: "Critical" },
    { id: "CUST-8832", type: "Customer ID", reason: "Account Takeover Suspected", addedOn: "2025-05-26", riskLevel: "High" },
    { id: "MERCH-992", type: "Merchant ID", reason: "Unusually high velocity", addedOn: "2025-05-20", riskLevel: "Medium" },
    { id: "IP-10.0.0.4", type: "IP Address", reason: "Known Botnet", addedOn: "2025-05-15", riskLevel: "Critical" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Watchlist</h1>
          <p className="text-sm text-slate-500 mt-1">Manage blocked or monitored entities.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Entity
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search watchlist..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all" />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Entity ID</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Risk Level</th>
              <th className="px-5 py-3 font-semibold">Reason</th>
              <th className="px-5 py-3 font-semibold">Added On</th>
              <th className="px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {entities.map((e, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${e.riskLevel === 'Critical' ? 'text-red-500' : 'text-amber-500'}`} />
                  {e.id}
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">{e.type}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${e.riskLevel === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' : e.riskLevel === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {e.riskLevel}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-slate-600">{e.reason}</td>
                <td className="px-5 py-4 text-xs text-slate-500">{e.addedOn}</td>
                <td className="px-5 py-4">
                  <button className="text-red-600 hover:text-red-800 text-xs font-bold transition-colors">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
