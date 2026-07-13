"use client";
import { useState } from "react";
import { Shield, Plus, Search, CheckCircle, XCircle } from "lucide-react";

export default function RiskRulesPage() {
  const [rules] = useState([
    { id: "R-101", name: "High Velocity Transactions", condition: "> 5 txns in 5 mins", action: "Block", status: "Active" },
    { id: "R-102", name: "New Device Large Amount", condition: "New Device AND Amount > $1000", action: "Review", status: "Active" },
    { id: "R-103", name: "Known Bad IP Subnet", condition: "IP in Watchlist", action: "Block", status: "Active" },
    { id: "R-104", name: "Mismatched Billing/Shipping", condition: "Billing != Shipping (International)", action: "Review", status: "Inactive" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Risk Rules</h1>
          <p className="text-sm text-slate-500 mt-1">Manage rules for the Fraud Decision Engine.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add New Rule
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search rules..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Rule ID</th>
              <th className="px-5 py-3 font-semibold">Rule Name</th>
              <th className="px-5 py-3 font-semibold">Condition</th>
              <th className="px-5 py-3 font-semibold">Action</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-medium text-slate-600">{rule.id}</td>
                <td className="px-5 py-4 font-bold text-slate-900">{rule.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block mt-2 border border-slate-100">{rule.condition}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${rule.action === 'Block' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {rule.action}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {rule.status === 'Active' ? (
                    <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <XCircle className="w-4 h-4" /> Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
